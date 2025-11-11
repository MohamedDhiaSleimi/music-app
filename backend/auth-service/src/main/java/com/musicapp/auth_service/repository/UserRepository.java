package com.musicapp.auth_service.repository;

import com.musicapp.auth_service.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmailOrUsername(String email, String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Optional<User> findByProviderAndProviderId(String provider, String providerId);

    // Password Reset
    Optional<User> findByPasswordResetToken(String token);

    // Account Deactivation
    List<User> findByDeactivatedAndDeactivationRequestedAtBefore(boolean deactivated, LocalDateTime dateTime);
}