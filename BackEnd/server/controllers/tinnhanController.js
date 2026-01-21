const Messages = require('../model/tinnhan');

exports.getAllMessages = (req, res) => {
    Messages.getAll((err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(result);
    });
};

exports.createMessages = (req, res) => {
    const messagesData = req.body;
    Messages
    .create(messagesData, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Messages added successfully");
    });
};


