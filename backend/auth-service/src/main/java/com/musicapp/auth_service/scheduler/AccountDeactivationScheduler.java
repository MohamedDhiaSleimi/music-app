package com.musicapp.auth_service.scheduler;

import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class AccountDeactivationScheduler {

    private final UserRepository userRepository;

    @Value("${password.reset.grace.period}")
    private Long gracePeriod;

    @Scheduled(cron = "0 0 2 * * ?") // Runs daily at 2 AM
    public void processAccountDeactivations() {
        log.info("Running account deactivation job...");

        LocalDateTime gracePeriodEnd = LocalDateTime.now().minusSeconds(gracePeriod / 1000);

        List<User> usersToDeactivate = userRepository
                .findByActiveAndDeactivationRequestedAtBefore(true, gracePeriodEnd);

        for (User user : usersToDeactivate) {
            user.setActive(false);
            user.setDeactivatedAt(LocalDateTime.now());
            userRepository.save(user);
            log.info("Deactivated account for user: {}", user.getEmail());
        }

        log.info("Account deactivation job completed. Deactivated {} accounts", usersToDeactivate.size());
    }
}