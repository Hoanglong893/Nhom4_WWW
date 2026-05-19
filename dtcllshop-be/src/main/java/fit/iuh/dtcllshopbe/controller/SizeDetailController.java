package fit.iuh.dtcllshopbe.controller;

import fit.iuh.dtcllshopbe.dto.request.SizeDetailRequest;
import fit.iuh.dtcllshopbe.dto.response.SizeDetailResponse;
import fit.iuh.dtcllshopbe.service.SizeDetailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/size-details")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SizeDetailController {
    SizeDetailService sizeDetailService;

    @GetMapping("/find")
    public SizeDetailResponse getSizeDetailByProductAndSize(@RequestParam("productId") int productId,
                                                            @RequestParam("sizeId") int sizeId) {
        SizeDetailRequest request = SizeDetailRequest.builder()
                .productId(productId)
                .sizeId(sizeId)
                .build();
        return sizeDetailService.findByProductAndSize(request);
    }
}