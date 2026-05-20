package fit.iuh.dtcllshopbe.service;

import fit.iuh.dtcllshopbe.dto.request.AddressRequest;
import fit.iuh.dtcllshopbe.dto.response.AddressResponse;
import fit.iuh.dtcllshopbe.entities.Account;
import fit.iuh.dtcllshopbe.entities.Address;
import fit.iuh.dtcllshopbe.exception.AppException;
import fit.iuh.dtcllshopbe.exception.ErrorCode;
import fit.iuh.dtcllshopbe.mapper.AddressMapper;
import fit.iuh.dtcllshopbe.repository.AddressRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AddressService {
    AddressRepository addressRepository;
    AccountService accountService;
    AddressMapper addressMapper;

    public List<AddressResponse> getAddressByAccountId(int accountId) {
        Account account = accountService.getAccountByAccountId(accountId);

        List<Address> addressList = addressRepository.findByAccount(account);

        return addressList
                .stream()
                .map(addressMapper::toAddressResponse)
                .toList();
    }

    public AddressResponse saveAddress(AddressRequest addressRequest) {
        Account account = accountService.getAccountByAccountId(addressRequest.getAccountId());

        Address a = new Address();
        a.setDelivery_address(addressRequest.getDelivery_address());
        a.setAccount(account);
        a.setProvince(addressRequest.getProvince());
        a.setDelivery_note(addressRequest.getDelivery_note());

        Address savedAddress = addressRepository.save(a);

        return addressMapper.toAddressResponse(savedAddress);
    }

    public AddressResponse updateAddress(AddressRequest addressRequest) {
        Address existingAddress = addressRepository.findById(addressRequest.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        existingAddress.setDelivery_address(addressRequest.getDelivery_address());
        existingAddress.setProvince(addressRequest.getProvince());
        existingAddress.setDelivery_note(addressRequest.getDelivery_note());
        // Account không thay đổi, giữ nguyên

        Address updatedAddress = addressRepository.save(existingAddress);

        return addressMapper.toAddressResponse(updatedAddress);
    }

    public void deleteAddress(Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
        addressRepository.delete(address);
    }

}
