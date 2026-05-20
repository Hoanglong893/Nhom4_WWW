package fit.iuh.dtcllshopbe.service;

import fit.iuh.dtcllshopbe.dto.request.SizeDetailRequest;
import fit.iuh.dtcllshopbe.dto.response.SizeDetailResponse;
import fit.iuh.dtcllshopbe.entities.Product;
import fit.iuh.dtcllshopbe.entities.Size;
import fit.iuh.dtcllshopbe.entities.SizeDetail;
import fit.iuh.dtcllshopbe.exception.AppException;
import fit.iuh.dtcllshopbe.exception.ErrorCode;
import fit.iuh.dtcllshopbe.mapper.SizeDetailMapper;
import fit.iuh.dtcllshopbe.repository.ProductRepository;
import fit.iuh.dtcllshopbe.repository.SizeDetailRepository;
import fit.iuh.dtcllshopbe.repository.SizeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor

public class SizeDetailService {
    SizeDetailRepository sizeDetailRepository;
    ProductRepository productRepository;
    SizeRepository sizeRepository;
    SizeDetailMapper sizeDetailMapper;

    public SizeDetailResponse findByProductAndSize(SizeDetailRequest sizeDetailRequest) {
        Product product =  productRepository.findById(sizeDetailRequest.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        Size size = sizeRepository.findById(sizeDetailRequest.getSizeId())
                .orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_FOUND));

        SizeDetail sizeDetail = sizeDetailRepository.findSizeDetailByProductAndSize(product, size);

        return sizeDetailMapper.toSizeDetailMapper(sizeDetail);
    }

    public SizeDetailResponse findById(int sizeId) {
         SizeDetail sizeDetail = sizeDetailRepository.findById(sizeId)
                 .orElseThrow(() -> new AppException(ErrorCode.SIZE_DETAIL_NOT_FOUND));

         return sizeDetailMapper.toSizeDetailMapper(sizeDetail);
    }
}