const router = require('../router/playList')
const Auth = require('../../../middleware/auth')
const Notification = require('../module/notification')

router.get('/all', Auth.authenGTUser, async (req, res, next) => {
    try {
        const id_account = Auth.getTokenData(req).id_account
        const data = await Notification.listAllNotification(id_account)
        return res.status(200).json({
            message: 'Danh sách thông báo thành công',
            data: data,
        })
    } catch (err) {
        return res.sendStatus(500)
    }
})

router.get('/:id_notification', Auth.authenGTUser, async (req, res, next) => {
    try {
        const id_notification = req.params.id_notification
        const data = await Notification.has(id_notification)
        return res.status(200).json({
            message: 'Lấy 1 thông báo thành công',
            data: data,
        })
    } catch (err) {
        return res.sendStatus(500)
    }
})

router.get('/list', Auth.authenGTUser, async (req, res, next) => {
    try {
        const id_account = Auth.getTokenData(req).id_account
        const data = await Notification.listNotification(id_account)
        return res.status(200).json({
            message: 'Danh sách thông báo chưa đọc thành công',
            data: data,
        })
    } catch (err) {
        return res.sendStatus(500)
    }
})

router.get('/count', Auth.authenGTUser, async (req, res, next) => {
    try {
        const id_account = Auth.getTokenData(req).id_account;
        const count = await Notification.countUnreadNotification(id_account);
        return res.status(200).json({
            message: 'Lấy số lượng thông báo chưa đọc',
            data: count,
        })
    } catch (err) {
        return res.sendStatus(500)
    }
})

router.get('/read_all', Auth.authenGTUser, async (req, res, next) => {
    try {
        const id_account = Auth.getTokenData(req).id_account;
        const data = await Notification.readAllNotification(id_account);
        return res.status(200).json({
            message: 'Đánh dấu đọc tất cả thông báo thành công',
            data: data,
        });
    } catch (err) {
        return res.sendStatus(500)
    }
})

router.delete('/delete_all', Auth.authenGTUser, async (req, res, next) => {
    try {
        const id_account = Auth.getTokenData(req).id_account;
        const data = await Notification.deleteAllNotification(id_account);
        return res.status(200).json({
            message: 'Xóa tất cả thông báo thành công',
            data: data,
        });
    } catch (err) {
        return res.sendStatus(500)
    }
})

router.get('/:id_notification', Auth.authenGTUser, async (req, res, next) => {
    try {
        const id_notification = req.params.id_notification;
        const notification = await Notification.has(id_notification);
        const id_account = Auth.getTokenData(req).id_account;

        if (!notification) {
            return res.status(404).json({
                message: 'Thông báo không tồn tại'
            })
        } else {
            if (notification.id_account !== id_account) {
                return res.status(403).json({
                    message: 'Bạn không có quyền đọc thông báo của người khác!'
                })
            }
            await Notification.readNotification(id_notification);
            return res.status(200).json({
                message: 'Lấy thông báo thành công',
                data: notification
            })
        }

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
})

router.get('/:id_notification/read', Auth.authenGTUser, async (req, res, next) => {
    try {
        const id_notification = req.params.id_notification;
        const notification_account = await Notification.has(id_notification);
        const id_account = Auth.getTokenData(req).id_account;

        if (!notification_account) {
            return res.status(404).json({
                message: 'Thông báo không tồn tại'
            })
        } else {
            if (+notification_account.id_account !== +id_account) {
                return res.status(403).json({
                    message: 'Bạn không có quyền đọc thông báo của người khác!'
                })
            }
            await Notification.readNotification(id_notification);
            return res.status(200).json({
                message: 'Đọc thông báo thành công',
            })
        }

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
})

router.delete('/:id_notification/delete', Auth.authenGTUser, async (req, res, next) => {
    try {
        const id_notification = req.params.id_notification;
        const notification_account = await Notification.has(id_notification);
        const id_account = Auth.getTokenData(req).id_account;

        console.log(notification_account)
        if (!notification_account) {
            return res.status(404).json({
                message: 'Thông báo không tồn tại'
            });
        }

        if (notification_account.id_account != id_account) {
            return res.status(401).json({
                message: 'Bạn không có quyền xóa thông báo này',
            })
        } else {
            const a = await Notification.deleteNotification(id_notification)
            console.log(a)
            return res.status(200).json({
                message: 'Xóa thông báo thành công'
            })
        }
    } catch (err) {
        return res.sendStatus(500)
    }
})

module.exports = router