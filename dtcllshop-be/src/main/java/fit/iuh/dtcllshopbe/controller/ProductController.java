// Updated ProductController.java
package fit.iuh.dtcllshopbe.controller;

import fit.iuh.dtcllshopbe.dto.request.ProductRequest;
import fit.iuh.dtcllshopbe.dto.response.ApiResponse;
import fit.iuh.dtcllshopbe.dto.response.ProductResponse;
import fit.iuh.dtcllshopbe.dto.response.TopProductResponse;
import fit.iuh.dtcllshopbe.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;

/**
 * Controller xử lý tất cả các API liên quan đến quản lý sản phẩm
 * Thuộc nhiệm vụ: Quản lý sản phẩm (Product Management)
 * Tác giả: Duy
 */
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductController {
    ProductService productService;

    /**
     * Lấy toàn bộ danh sách sản phẩm trong hệ thống
     * @return ApiResponse chứa danh sách ProductResponse
     */
    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        log.info("[ProductController] Yêu cầu lấy danh sách toàn bộ sản phẩm");
        ApiResponse<List<ProductResponse>> response = new ApiResponse<>();
        response.setResult(productService.getAllProducts());
        return response;
    }

    /**
     * Lấy chi tiết thông tin một sản phẩm dựa vào ID
     * @param id ID của sản phẩm cần lấy
     * @return ApiResponse chứa chi tiết ProductResponse
     */
    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable int id) {
        log.info("[ProductController] Yêu cầu lấy thông tin sản phẩm ID: {}", id);
        ApiResponse<ProductResponse> response = new ApiResponse<>();
        response.setResult(productService.getProductById(id));
        return response;
    }

    /**
     * Lấy danh sách sản phẩm hàng loạt dựa trên danh sách ID cung cấp
     * @param ids Danh sách các ID sản phẩm
     * @return ApiResponse chứa danh sách ProductResponse tương ứng
     */
    @GetMapping("/batch")
    public ApiResponse<List<ProductResponse>> getProductsByIds(@RequestParam("ids") List<Integer> ids) {
        log.info("[ProductController] Yêu cầu lấy hàng loạt sản phẩm cho các ID: {}", ids);
        ApiResponse<List<ProductResponse>> response = new ApiResponse<>();

        if (ids == null || ids.isEmpty()) {
            log.warn("[ProductController] Danh sách ID sản phẩm trống!");
            response.setResult(Collections.emptyList());
            return response;
        }

        response.setResult(productService.getProductsByIds(ids));
        return response;
    }

    /**
     * Tạo một sản phẩm mới trong hệ thống
     * @param productRequest DTO chứa thông tin sản phẩm mới cần tạo
     * @return ApiResponse chứa thông tin sản phẩm sau khi lưu thành công
     */
    @PostMapping
    public ApiResponse<ProductResponse> createProduct(@RequestBody ProductRequest productRequest) {
        log.info("[ProductController] Yêu cầu tạo sản phẩm mới có tên: {}", productRequest.getName());
        ApiResponse<ProductResponse> response = new ApiResponse<>();
        response.setResult(productService.createProduct(productRequest));
        return response;
    }

    /**
     * Cập nhật thông tin của sản phẩm hiện tại
     * @param id ID của sản phẩm cần cập nhật
     * @param productRequest DTO chứa dữ liệu cập nhật
     * @return ApiResponse chứa thông tin sản phẩm đã cập nhật thành công
     */
    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable int id, @RequestBody ProductRequest productRequest) {
        log.info("[ProductController] Yêu cầu cập nhật sản phẩm ID: {}", id);
        ApiResponse<ProductResponse> response = new ApiResponse<>();
        response.setResult(productService.updateProduct(id, productRequest));
        return response;
    }

    /**
     * Xóa sản phẩm khỏi hệ thống
     * @param id ID của sản phẩm cần xóa
     * @return ApiResponse thông báo xóa thành công
     */
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteProduct(@PathVariable int id) {
        log.info("[ProductController] Yêu cầu xóa sản phẩm ID: {}", id);
        productService.deleteProduct(id);
        ApiResponse<String> response = new ApiResponse<>();
        response.setResult("Product deleted successfully");
        return response;
    }

    /**
     * Lấy danh sách sản phẩm bán chạy theo mốc thời gian xu hướng
     * @param type Loại lọc theo mốc (ví dụ: week, month)
     * @return Danh sách sản phẩm xu hướng
     */
    @GetMapping("/top-trending")
    public List<TopProductResponse> getTopTrending(
            @RequestParam(defaultValue = "week") String type) {
        log.info("[ProductController] Yêu cầu lấy top sản phẩm bán chạy theo loại: {}", type);
        return productService.getTopTrending(type);
    }

    /**
     * Lấy số liệu thống kê sản phẩm tổng quan của kho hàng
     * @return ApiResponse chứa số liệu thống kê kho hàng
     */
    @GetMapping("/stats")
    public ApiResponse<?> getStats() {
        log.info("[ProductController] Yêu cầu lấy số liệu thống kê sản phẩm");
        return ApiResponse.<Object>builder()
                .result(productService.getDashboardStats())
                .build();
    }
}

