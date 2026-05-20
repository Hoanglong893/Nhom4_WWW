package fit.iuh.dtcllshopbe.controller;


import com.nimbusds.jwt.SignedJWT;
import fit.iuh.dtcllshopbe.entities.Account;
import fit.iuh.dtcllshopbe.entities.Order;
import fit.iuh.dtcllshopbe.entities.Product;
import fit.iuh.dtcllshopbe.repository.AccountRepository;
import fit.iuh.dtcllshopbe.repository.OrderRepository;
import fit.iuh.dtcllshopbe.service.GeminiService;
import fit.iuh.dtcllshopbe.service.ProductCacheService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final GeminiService geminiService;
    private final ProductCacheService productCacheService;
    private final AccountRepository accountRepository;
    private final OrderRepository orderRepository;

    // Lưu lịch sử chat theo session/user-id (dùng để Gemini nhớ ngữ cảnh)
    private static final Map<String, Deque<String>> chatHistory = new ConcurrentHashMap<>();
    private static final int MAX_MESSAGES = 10;

    public ChatController(GeminiService geminiService,
                          ProductCacheService productCacheService,
                          AccountRepository accountRepository,
                          OrderRepository orderRepository) {
        this.geminiService = geminiService;
        this.productCacheService = productCacheService;
        this.accountRepository = accountRepository;
        this.orderRepository = orderRepository;
    }

    // ================== ENDPOINT MỚI: TRẢ VỀ JSON CÓ LINK SẢN PHẨM ==================
    @PostMapping("/ask")
    public ResponseEntity<Map<String, Object>> askGemini(
            HttpServletRequest request,
            @RequestBody PromptRequest promptRequest
    ) {
        String token = extractToken(request.getHeader("Authorization"));
        String userPrompt = promptRequest.getPrompt().trim();

        if (userPrompt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "message", "Dạ anh/chị nhắn gì cho em với ạ!",
                    "suggestedProducts", List.of()
            ));
        }

        // ── Xác định user từ JWT (nếu có) ──────────────────────────────────
        String username = extractUsernameFromToken(token);
        String userId = username != null ? "user_" + username : (token != null ? "token_" + token.substring(0, Math.min(20, token.length())) : "guest_" + UUID.randomUUID());
        Deque<String> history = chatHistory.computeIfAbsent(userId, k -> new ArrayDeque<>());

        // Lưu tin nhắn user
        history.addFirst("user: " + userPrompt);
        keepOnlyLastN(history, MAX_MESSAGES);

        // ── Context sản phẩm ────────────────────────────────────────────────
        String productContext = buildFullProductContextWithCostPrice();

        // ── Context đơn hàng của khách (nếu đã login) ───────────────────────
        String orderContext = "";
        String greeting = "";
        if (username != null) {
            try {
                Optional<Account> accOpt = accountRepository.findByUsername(username);
                if (accOpt.isPresent()) {
                    Account acc = accOpt.get();
                    String customerName = (acc.getCustomer() != null && acc.getCustomer().getFullName() != null)
                            ? acc.getCustomer().getFullName() : username;
                    greeting = "Khách đang đăng nhập tên: " + customerName + " (username: " + username + ")\n";
                    orderContext = buildOrderContext(acc);
                }
            } catch (Exception e) {
                System.err.println("[ChatController] Lỗi load thông tin user: " + e.getMessage());
            }
        }

        String shopInfo = """
            === DTCLL SHOP ===
            - Chỉ bán online, ship toàn quốc
            - Đổi trả miễn phí 7 ngày (lỗi NSX)
            - Hotline/Zalo: 0903.456.789
            - Giờ làm: 8h30 - 22h00
            - Quy trình đặt hàng: Chọn sản phẩm → chọn size → điền thông tin giao hàng → chọn phương thức thanh toán (COD hoặc chuyển khoản ngân hàng)
            - Thanh toán chuyển khoản: Quét mã QR hiện trên màn hình sau khi đặt hàng, đơn sẽ được xác nhận tự động sau khi nhận được tiền
            - Thanh toán COD: Thanh toán khi nhận hàng, không cần trả trước
            - Sau khi đặt hàng thành công, khách có thể theo dõi đơn tại mục "Đơn hàng của tôi"
            - Liên hệ hỗ trợ: Mr Hoang Long - Zalo 0398757483
            """;

        String historyText = history.isEmpty() ? ""
                : "Lịch sử chat gần đây (mới nhất ở trên):\n" + String.join("\n", history) + "\n";

        String finalPrompt = """
            Bạn là trợ lý mua sắm SIÊU DỄ THƯƠNG của DTCLL Shop.
            Xưng "em", gọi khách là "anh/chị" (nếu biết tên thì gọi tên), dùng emoji vừa phải.
            Trả lời ngắn gọn, tối đa 4 câu. Không bịa thông tin ngoài dữ liệu được cung cấp.
            Nếu khách hỏi về thanh toán hay trạng thái đơn hàng, hãy dựa vào phần "ĐƠN HÀNG CỦA KHÁCH" bên dưới.
            Nếu khách muốn chốt đơn/mua hàng, hướng dẫn họ: thêm vào giỏ hàng → tiến hành thanh toán → chọn địa chỉ → chọn COD hoặc QR banking.

            THÔNG TIN SHOP:
            %s

            %s

            ĐƠN HÀNG CỦA KHÁCH:
            %s

            DANH SÁCH SẢN PHẨM (giá cuối = costPrice):
            %s

            LỊCH SỬ CHAT:
            %s

            Khách vừa hỏi: "%s"
            Hãy trả lời dễ thương và chính xác nhé!
            """.formatted(shopInfo, greeting, orderContext.isEmpty() ? "Khách chưa đăng nhập hoặc chưa có đơn nào." : orderContext, productContext, historyText, userPrompt);

        try {
            String reply = geminiService.generateText(finalPrompt);

            String botReply = reply == null || reply.trim().isEmpty()
                    ? "Dạ để em kiểm tra lại giúp anh/chị nha!"
                    : reply.trim();

            // Lưu tin bot vào lịch sử
            history.addFirst("bot: " + botReply);
            keepOnlyLastN(history, MAX_MESSAGES);

            // === PHẦN MỚI: Tìm các sản phẩm được nhắc đến trong câu trả lời của bot ===
            List<Map<String, Object>> suggestedProducts = findSuggestedProducts(botReply);

            // ================== THÊM MỚI: PHÁT HIỆN YÊU CẦU SO SÁNH ==================
            List<Long> compareIds = detectCompareRequest(userPrompt, botReply);

            Map<String, Object> response = new HashMap<>();
            response.put("message", botReply);
            response.put("suggestedProducts", suggestedProducts);

            // Nếu khách muốn so sánh → thêm field compareIds
            if (compareIds != null && compareIds.size() >= 2 && compareIds.size() <= 4) {
                response.put("compareIds", compareIds);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Em đang hơi lag xíu, anh/chị nhắn lại giúp em nha!");
            errorResponse.put("suggestedProducts", List.of());
            errorResponse.put("compareIds", null); // thêm cho an toàn
            return ResponseEntity.ok(errorResponse);
        }
    }

    // ================== HÀM MỚI: Tìm sản phẩm được nhắc đến trong câu trả lời của bot ==================
    private List<Map<String, Object>> findSuggestedProducts(String botReply) {
        List<Product> allProducts = productCacheService.getAllProducts();
        if (allProducts.isEmpty()) return List.of();

        String lowerReply = botReply.toLowerCase();

        return allProducts.stream()
                .filter(product -> {
                    String productNameLower = product.getName().toLowerCase();
                    return lowerReply.contains(productNameLower) ||
                            lowerReply.contains(productNameLower.replace(" ", "")) ||
                            lowerReply.contains(productNameLower.replace("-", "")) ||
                            lowerReply.contains(productNameLower.replace("&", ""));
                })
                .map(product -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", product.getId());
                    map.put("name", product.getName());
                    return map;
                })
                .distinct()
                .limit(5)
                .collect(Collectors.toList());
    }

    // ================== HÀM MỚI: PHÁT HIỆN YÊU CẦU SO SÁNH & TRẢ VỀ DANH SÁCH ID ==================
    private List<Long> detectCompareRequest(String userPrompt, String botReply) {
        String text = (userPrompt + " " + botReply).toLowerCase();
        System.out.println("=== [COMPARE DETECT] Bắt đầu kiểm tra yêu cầu so sánh ===");
        System.out.println("Text kết hợp (user + bot): " + text);

        // Từ khóa tiếng Việt phổ biến khi muốn so sánh
        boolean isCompareIntent = text.contains("so sánh") ||
                text.contains("vs") ||
                text.contains("versus") ||
                text.contains("đối chiếu") ||
                text.contains("khác nhau") ||
                text.contains("nên mua cái nào") ||
                text.contains("cái nào tốt ho") ||
                text.contains("vs với") ||
                text.contains("so với") ||
                (text.contains("trong 2 cái") && (text.contains("trong hai cái") || text.contains("so kè") || text.contains("phân tích")));
        System.out.println("Có từ khóa so sánh không? → " + isCompareIntent);
        if (!isCompareIntent){
            System.out.println("→ Không phát hiện ý định so sánh → trả về null");
            return null;
        }

        List<Product> allProducts = productCacheService.getAllProducts();
        Set<Long> mentionedIds = new HashSet<>();
        System.out.println("Danh sách sản phẩm đang kiểm tra (" + allProducts.size() + " món):");

        for (Product p : allProducts) {
            String name = p.getName().toLowerCase();
            String cleanName = name.replace(" ", "").replace("-", "").replace("&", "").replace("jeans", "").replace("shirt", "");

            if (text.contains(name) || text.contains(cleanName)) {
                mentionedIds.add((long) p.getId());
            }
        }

        if (mentionedIds.size() >= 2 && mentionedIds.size() <= 4) {
            return new ArrayList<>(mentionedIds);
        }

        return null;
    }

    // ================== CODE CŨ GIỮ NGUYÊN HOÀN TOÀN ==================
    private String buildFullProductContextWithCostPrice() {
        List<Product> products = productCacheService.getAllProducts();
        if (products.isEmpty()) {
            return "Shop đang cập nhật sản phẩm mới ạ!";
        }

        StringBuilder sb = new StringBuilder("=== DANH SÁCH SẢN PHẨM ===\n");

        for (Product p : products) {
            String finalPrice = String.format("%,.0fđ", p.getCostPrice());

            String sizeStr = p.getSizeDetails() == null || p.getSizeDetails().isEmpty()
                    ? "Hết hàng"
                    : p.getSizeDetails().stream()
                    .filter(sd -> sd.getQuantity() > 0)
                    .map(sd -> sd.getSize().getNameSize() + ":" + sd.getQuantity() + "c")
                    .reduce((a, b) -> a + ", " + b)
                    .orElse("Hết hàng");

            sb.append(String.format(
                    "• %s | Giá cuối: %s | Giảm: %,.0f%% | Rating: %.1f | Mô tả: %s | Chất liệu: %s | Form: %s | Size còn: %s\n",
                    p.getName(),
                    finalPrice,
                    p.getDiscountAmount(),
                    p.getRating(),
                    p.getDescription(),
                    p.getMaterial(),
                    p.getForm(),
                    sizeStr
            ));
        }

        sb.append("Tổng cộng: ").append(products.size()).append(" sản phẩm\n");
        return sb.toString();
    }

    private void keepOnlyLastN(Deque<String> deque, int max) {
        while (deque.size() > max) {
            deque.removeLast();
        }
    }

    public static class PromptRequest {
        private String prompt;
        public String getPrompt() { return prompt; }
        public void setPrompt(String prompt) { this.prompt = prompt; }
    }

    private String extractToken(String header) {
        if (header == null || !header.startsWith("Bearer ")) return null;
        return header.substring(7).trim();
    }

    // ── Đọc username từ JWT payload (không cần verify signature) ──────────────
    private String extractUsernameFromToken(String token) {
        if (token == null || token.isBlank()) return null;
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            Object sub = signedJWT.getJWTClaimsSet().getClaim("sub");
            return sub != null ? sub.toString() : null;
        } catch (Exception e) {
            System.err.println("[ChatController] Không parse được JWT: " + e.getMessage());
            return null;
        }
    }

    // ── Xây dựng context đơn hàng của khách đang login ─────────────────────────
    private String buildOrderContext(Account account) {
        try {
            List<Order> orders = orderRepository.findByAccountWithDetails(account);
            if (orders == null || orders.isEmpty()) {
                return "Khách chưa có đơn hàng nào.";
            }

            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
            StringBuilder sb = new StringBuilder();
            sb.append("Khách có ").append(orders.size()).append(" đơn hàng:\n");

            // Chỉ lấy tối đa 5 đơn gần nhất để tránh prompt quá dài
            orders.stream()
                .sorted((a, b) -> {
                    if (a.getOrderDate() == null) return 1;
                    if (b.getOrderDate() == null) return -1;
                    return b.getOrderDate().compareTo(a.getOrderDate());
                })
                .limit(5)
                .forEach(order -> {
                    sb.append("• Mã đơn: ").append(order.getOrderCode());
                    sb.append(" | Trạng thái: ").append(mapStatus(order.getStatusOrder()));
                    sb.append(" | Ngày đặt: ").append(
                        order.getOrderDate() != null ? sdf.format(order.getOrderDate()) : "N/A"
                    );
                    sb.append(" | Thanh toán: ").append(mapPayment(order.getPaymentMethod()));

                    // Lấy tổng tiền từ Invoice
                    if (order.getInvoice() != null) {
                        sb.append(String.format(" | Tổng tiền: %,.0fđ", order.getInvoice().getTotalAmount()));
                        sb.append(" | Trạng thái TT: ").append(
                            order.getInvoice().getPaymentStatus() != null
                                ? order.getInvoice().getPaymentStatus().toString() : "Chưa xác định"
                        );
                    }

                    // Liệt kê sản phẩm trong đơn
                    if (order.getOrderDetails() != null && !order.getOrderDetails().isEmpty()) {
                        sb.append(" | Sản phẩm: ");
                        order.getOrderDetails().forEach(detail ->
                            sb.append(detail.getProductName())
                              .append(" x").append(detail.getQuantity())
                              .append(", ")
                        );
                        // Xóa dấu phẩy cuối
                        if (sb.charAt(sb.length() - 2) == ',') {
                            sb.setLength(sb.length() - 2);
                        }
                    }
                    sb.append("\n");
                });

            return sb.toString();
        } catch (Exception e) {
            System.err.println("[ChatController] Lỗi buildOrderContext: " + e.getMessage());
            return "Không thể tải lịch sử đơn hàng lúc này.";
        }
    }

    private String mapStatus(Object status) {
        if (status == null) return "Không rõ";
        return switch (status.toString()) {
            case "PENDING" -> "Chờ xác nhận";
            case "CONFIRMED" -> "Đã xác nhận";
            case "PROCESSING" -> "Đang xử lý";
            case "DELIVERING" -> "Đang giao";
            case "COMPLETED" -> "Hoàn thành";
            case "CANCELLED" -> "Đã hủy";
            default -> status.toString();
        };
    }

    private String mapPayment(Object method) {
        if (method == null) return "Không rõ";
        return switch (method.toString()) {
            case "CASH" -> "COD (tiền mặt)";
            case "BANK_TRANSFER" -> "Chuyển khoản ngân hàng";
            default -> method.toString();
        };
    }
}