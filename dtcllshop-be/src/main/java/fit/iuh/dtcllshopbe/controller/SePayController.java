package fit.iuh.dtcllshopbe.controller;

import fit.iuh.dtcllshopbe.dto.request.SePayRequest;
import fit.iuh.dtcllshopbe.dto.response.SePayResponse;
import fit.iuh.dtcllshopbe.service.SePayService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SePayController {

    SePayService sePayService;

    @PostMapping("/sepay-callback")
    public ResponseEntity<SePayResponse> sePayCallback(
            @RequestBody SePayRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String apiKey = "DTCLL_SHOP_KEY";

        if (authHeader != null && authHeader.startsWith("Apikey ")) {
            apiKey = authHeader.replace("Apikey ", "");
        }

        SePayResponse response = sePayService.handleCallback(request, apiKey);
        return ResponseEntity.ok(response);
    }
}
