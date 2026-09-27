package com.example.exam.service;

import com.example.exam.dto.NotificationResponse;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getUserNotifications(Long userId);
    void markAsRead(Long notificationId, Long userId);
    void createNotification(Long userId, String title, String message);
}
