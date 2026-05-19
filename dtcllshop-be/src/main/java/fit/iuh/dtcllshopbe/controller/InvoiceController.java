package fit.iuh.dtcllshopbe.controller;

import fit.iuh.dtcllshopbe.dto.request.CreateInvoiceRequest;
import fit.iuh.dtcllshopbe.dto.response.InvoiceResponse;
import fit.iuh.dtcllshopbe.dto.response.PaymentStatisticResponse;
import fit.iuh.dtcllshopbe.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Map;

/**
 * Controller xử lý tất cả các API liên quan đến hóa đơn và doanh thu
 * Thuộc nhiệm vụ: Quản lý doanh thu & lợi nhuận (Revenue Management)
 * Tác giả: Duy
 */
@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InvoiceController {
    InvoiceService invoiceService;

    /**
     * Lấy toàn bộ danh sách hóa đơn trong hệ thống
     * @return Danh sách InvoiceResponse
     */
    @GetMapping
    public List<InvoiceResponse> getAllInvoices() {
        log.info("[InvoiceController] Yêu cầu lấy toàn bộ danh sách hóa đơn");
        return invoiceService.getAllInvoices();
    }

    /**
     * Tạo hóa đơn mới khi người dùng đặt hàng thành công
     * @param request DTO chứa thông tin tạo hóa đơn
     * @return ResponseEntity chứa InvoiceResponse và trạng thái HTTP CREATED
     */
    @PostMapping
    public ResponseEntity<InvoiceResponse> createInvoice(@Valid @RequestBody CreateInvoiceRequest request) {
        log.info("[InvoiceController] Yêu cầu tạo hóa đơn mới cho đơn hàng ID: {}", request.getOrderId());
        InvoiceResponse response = invoiceService.createInvoice(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Thống kê lợi nhuận theo các ngày trong tuần hiện tại
     * @return Danh sách các cặp ngày và số tiền lợi nhuận
     */
    @GetMapping("/week")
    public List<Map<String, Object>> getProfitByWeek() {
        LocalDate today = LocalDate.now();
        LocalDate start = today.with(DayOfWeek.MONDAY);
        LocalDate end = today.with(DayOfWeek.SUNDAY);
        log.info("[InvoiceController] Thống kê doanh thu tuần từ {} đến {}", start, end);
        return invoiceService.getProfitWeekly(start, end);
    }

    /**
     * Thống kê lợi nhuận theo các tháng trong năm hiện tại
     * @return Danh sách các cặp tháng và số tiền lợi nhuận
     */
    @GetMapping("/month")
    public List<Map<String, Object>> getProfitByMonth() {
        LocalDate today = LocalDate.now();
        LocalDate start = today.withDayOfMonth(1);
        LocalDate end = today.withDayOfMonth(today.lengthOfMonth());
        log.info("[InvoiceController] Thống kê doanh thu tháng từ {} đến {}", start, end);
        return invoiceService.getProfitMonthly(start, end);
    }

    /**
     * Thống kê lợi nhuận theo các năm
     * @return Danh sách lợi nhuận theo từng năm
     */
    @GetMapping("/year")
    public List<Map<String, Object>> getProfitByYear() {
        LocalDate today = LocalDate.now();
        LocalDate start = today.withDayOfYear(1);
        LocalDate end = today.withDayOfYear(today.lengthOfYear());
        log.info("[InvoiceController] Thống kê doanh thu năm từ {} đến {}", start, end);
        return invoiceService.getProfitYearly(start, end);
    }

    /**
     * Lấy thống kê tỷ lệ các phương thức thanh toán sử dụng
     * @return Danh sách thống kê phương thức thanh toán
     */
    @GetMapping("/payment")
    public List<PaymentStatisticResponse> getPaymentStatistics() {
        log.info("[InvoiceController] Yêu cầu lấy thống kê các phương thức thanh toán");
        return invoiceService.getPaymentStatistics();
    }

    /**
     * Lấy chi tiết thông tin hóa đơn theo ID
     * @param id ID của hóa đơn cần lấy
     * @return Chi tiết thông tin InvoiceResponse
     */
    @GetMapping("/{id}")
    public InvoiceResponse getInvoice(@PathVariable int id) {
        log.info("[InvoiceController] Yêu cầu lấy thông tin chi tiết hóa đơn ID: {}", id);
        return invoiceService.getInvoiceById(id);
    }
}
