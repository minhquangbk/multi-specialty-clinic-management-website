const Appointment = require('../model/datlichkham');

exports.addAppointment = (req, res) => {
    
    const appointmentData = req.body; // Retrieve data from the request body

    Appointment.addAppointment(appointmentData, (err,message ) => {
        if (err) {
            return res.status(500).send({ message: "Error creating appointment", error: err });
        }
        res.status(200).send({ message: 'Appointment scheduled successfully'});
    });
};

exports.cancelAppointment = (req, res) => {
    const { id_lich_kham } = req.params;
    const Appointmentdata = req.body;
    Appointment.update(id_lich_kham, Appointmentdata, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Appointment updated successfully");
    });
};

exports.createAppointment = (req, res) => {
    const Data = req.body;
    Appointment.create(Data, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send("Employee added successfully");
    });
};

