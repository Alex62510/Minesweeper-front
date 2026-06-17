/* eslint-disable no-undef */
/**
 * Service Worker для Web Push.
 * Payload: { title, body, url, image_url } или custom_data/data с url/image.
 */
self.addEventListener('push', function (event) {
    var title = 'Уведомление';
    var body = '';
    var targetUrl = '';
    var imageUrl = '';
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
        if (data.title) title = String(data.title);
        if (data.body) body = String(data.body);
        if (data.custom_data && data.custom_data.url) {
            targetUrl = String(data.custom_data.url);
        } else if (data.data && data.data.url) {
            targetUrl = String(data.data.url);
        } else if (data.url) {
            targetUrl = String(data.url);
        }
        // ← картинка из рассылки
        if (data.image_url) {
            imageUrl = String(data.image_url);
        } else if (data.image) {
            imageUrl = String(data.image);
        } else if (data.custom_data && data.custom_data.image_url) {
            imageUrl = String(data.custom_data.image_url);
        } else if (data.data && data.data.image_url) {
            imageUrl = String(data.data.image_url);
        } else if (data.icon) {
            imageUrl = String(data.icon);
        }
    }
    var options = {
        body: body,
        data: { url: targetUrl, image: imageUrl },
        requireInteraction: true,
    };
    // в системном уведомлении — фото как icon
    if (imageUrl) {
        options.icon = imageUrl;
        options.image = imageUrl; // Chrome: большое изображение
    } else if (data.icon) {
        options.icon = data.icon;
    }
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
                        image: imageUrl, // ← для toast на странице
                    });
                });
            }),
        ])
    );
});
function isExternalUrl(url) {
    if (!url) return false;
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
    if (!url) return;
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            if (isExternalUrl(url)) {
                if (clients.openWindow) return clients.openWindow(url);
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
            if (clients.openWindow) return clients.openWindow(url);
        })
    );
});
