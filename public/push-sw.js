/* eslint-disable no-undef */
/**
 * Service Worker для Web Push (демо / прод).
 * Ожидает payload JSON: { "title": "...", "body": "...", "url": "https://..." }
 * или { "custom_data": { "url": "..." } } / { "data": { "url": "..." } }
 */
self.addEventListener('push', function (event) {
    var title = 'Уведомление';
    var body = '';
    var targetUrl = '';
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
        if (data.custom_data && data.custom_data.url) {
            targetUrl = String(data.custom_data.url);
        } else if (data.data && data.data.url) {
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
    event.waitUntil(
        Promise.all([
            self.registration.showNotification(title, options),
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
                list.forEach(function (client) {
                    client.postMessage({
                        type: 'PUSH_RECEIVED',
                        title: title,
                        body: body,
                        url: targetUrl,
                    });
                });
            }),
        ])
    );
});
function isExternalUrl(url) {
    if (!url) {
        return false;
    }
    try {
        return new URL(url, self.location.origin).origin !== self.location.origin;
    } catch (e) {
        return true;
    }
}
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    var url = '';
    if (event.notification && event.notification.data && event.notification.data.url) {
        url = String(event.notification.data.url).trim();
    }
    if (!url) {
        return;
    }
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            if (isExternalUrl(url)) {
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
                return;
            }
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if ('navigate' in client) {
                    return client.navigate(url).then(function () {
                        return client.focus();
                    });
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
