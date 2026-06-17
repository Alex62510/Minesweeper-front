/* eslint-disable no-undef */
/**
 * Service Worker для Web Push (положить в public/push-sw.js на сайте клиента).
 * Payload: { title, body, url, image_url } или custom_data/data с url/image.
 */
(function () {
    'use strict';

    var DEFAULT_PUSH_ICON_DATA_URI =
        'data:image/svg+xml,' +
        encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">' +
            '<defs><linearGradient id="g" x1="96" y1="16" x2="96" y2="176" gradientUnits="userSpaceOnUse">' +
            '<stop offset="0" stop-color="#FFD54F"/><stop offset="1" stop-color="#FF9800"/></linearGradient></defs>' +
            '<rect width="192" height="192" rx="44" fill="url(#g)"/>' +
            '<circle cx="96" cy="96" r="54" fill="none" stroke="#fff" stroke-width="5"/>' +
            '<path d="M42 96h108M96 42c15 17 24 37 24 54s-9 37-24 54M96 42c-15 17 24 37 24 54s9 37 24 54" ' +
            'fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>'
        );

    function pickUrl(data) {
        if (!data || typeof data !== 'object') {
            return '';
        }
        if (data.custom_data && data.custom_data.url) {
            return String(data.custom_data.url);
        }
        if (data.data && data.data.url) {
            return String(data.data.url);
        }
        if (data.url) {
            return String(data.url);
        }
        return '';
    }

    function pickImageUrl(data) {
        if (!data || typeof data !== 'object') {
            return '';
        }
        if (data.image_url) {
            return String(data.image_url);
        }
        if (data.image) {
            return String(data.image);
        }
        if (data.custom_data && data.custom_data.image_url) {
            return String(data.custom_data.image_url);
        }
        if (data.data && data.data.image_url) {
            return String(data.data.image_url);
        }
        return '';
    }

    function resolvePushIcon(imageUrl) {
        return imageUrl || DEFAULT_PUSH_ICON_DATA_URI;
    }

    function parsePushPayload(event) {
        var title = 'Уведомление';
        var body = '';
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
        }

        return {
            title: title,
            body: body,
            url: pickUrl(data),
            image: pickImageUrl(data),
        };
    }

    function notifyOpenTabs(payload) {
        return clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
            list.forEach(function (client) {
                client.postMessage({
                    type: 'PUSH_RECEIVED',
                    title: payload.title,
                    body: payload.body,
                    url: payload.url,
                    image: payload.image,
                });
            });
        });
    }

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

    self.addEventListener('push', function (event) {
        var payload = parsePushPayload(event);
        var options = {
            body: payload.body,
            data: { url: payload.url, image: payload.image },
            requireInteraction: true,
            icon: resolvePushIcon(payload.image),
        };

        if (payload.image) {
            options.image = payload.image;
        }

        event.waitUntil(
            Promise.all([
                self.registration.showNotification(payload.title, options),
                notifyOpenTabs(payload),
            ])
        );
    });

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
                    if ('focus' in client) {
                        if ('navigate' in client) {
                            return client.navigate(url).then(function () {
                                return client.focus();
                            });
                        }
                        return client.focus();
                    }
                }

                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
        );
    });
})();

