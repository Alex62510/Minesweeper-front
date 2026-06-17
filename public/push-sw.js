/* eslint-disable no-undef */
/**
 * Service Worker для Web Push (демо / прод).
 * Ожидает payload JSON: { "title": "...", "body": "...", "url": "https://..." }
 * (как собирает daemons PushSender для web).
 */
self.addEventListener('push', function (event) {
    var title = 'Уведомление';
    var body = '';
    var targetUrl = '/';
    var data = {};

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            try {
                body = event.data.text();
            } catch (e2) {
                body = '';
            }
        }
    }

    if (data && typeof data === 'object') {
        if (data.title) {
            title = String(data.title);
        }
        if (data.body) {
            body = String(data.body);
        }
        if (data.data && data.data.url) {
            targetUrl = String(data.data.url);
        } else if (data.url) {
            targetUrl = String(data.url);
        }
    }

    var options = {
        body: body,
        data: { url: targetUrl },
        icon: data.icon || undefined,
        requireInteraction: true,
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    var url = '/';
    if (event.notification && event.notification.data && event.notification.data.url) {
        url = event.notification.data.url;
    }
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            var i;
            for (i = 0; i < clientList.length; i++) {
                if (clientList[i].url && url !== '/') {
                    clientList[i].navigate(url);
                    return clientList[i].focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
