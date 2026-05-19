package fit.iuh.dtcllshopbe.controller;

import fit.iuh.dtcllshopbe.dto.request.CustomerTradingRequest;
import fit.iuh.dtcllshopbe.dto.response.CustomerTradingResponse;
import fit.iuh.dtcllshopbe.dto.response.RegionStatisticResponse;
import fit.iuh.dtcllshopbe.entities.CustomerTrading;
import fit.iuh.dtcllshopbe.service.CustomerTradingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controller xử lý tất cả các API liên quan đến hoạt động giao dịch khách hàng
 * Thuộc nhiệm vụ: Quản lý khách hàng (Customer Management)
 * Tác giả: Duy
 */
@RestController
@RequestMapping("/customer-trading")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CustomerTradingController {

    CustomerTradingService customerTradingService;

    /**
     * Ghi nhận một giao dịch mới của khách hàng vào hệ thống
     * @param customerTradingRequest DTO chứa thông tin giao dịch cần tạo
     * @return DTO phản hồi chi tiết giao dịch sau khi ghi nhận thành công
     */
    @PostMapping("/create")
    public CustomerTradingResponse customerTradingResponse(@RequestBody CustomerTradingRequest customerTradingRequest) {
        log.info("[CustomerTradingController] Yêu cầu tạo giao dịch mới cho khách hàng ID: {}", customerTradingRequest.getAccountId());
        return customerTradingService.addCustomerTrading(customerTradingRequest);
    }

    /**
     * Lấy thông tin giao dịch chi tiết theo ID giao dịch
     * @param customerTradingId ID của giao dịch cần truy vấn
     * @return Thực thể CustomerTrading chứa chi tiết giao dịch
     */
    @GetMapping("/{customerTradingId}")
    public CustomerTrading getCustomerTrading(@PathVariable int customerTradingId) {
        log.info("[CustomerTradingController] Yêu cầu lấy thông tin giao dịch ID: {}", customerTradingId);
        return customerTradingService.getCustomerTradingById(customerTradingId);
    }

    /**
     * Lấy thống kê mật độ khách hàng theo từng khu vực địa lý
     * @return Danh sách thống kê khu vực địa lý RegionStatisticResponse
     */
    @GetMapping("/regions")
    public List<RegionStatisticResponse> getRegionStatistics() {
        log.info("[CustomerTradingController] Yêu cầu truy xuất thống kê địa lý vùng miền của khách hàng");
        return customerTradingService.getRegionStats();
    }
}
