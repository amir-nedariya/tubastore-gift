const Contact = require("../models/Contact");

const addcontact = async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    // validate required fields
    if (!name || !phone || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // validate phone length (only 10 digits allowed)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Phone must be exactly 10 digits" });
    }

    // 🔹 check if this phone already submitted 3 messages
    const count = await Contact.countDocuments({ phone });
    if (count >= 3) {
      return res.status(400).json({
        error: "This phone number has reached the maximum limit of 3 messages",
      });
    }

    // create new contact
    const newContact = new Contact({ name, phone, message });
    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Message submitted successfully",
      contact: newContact,
    });
  } catch (err) {
    console.error("Error adding contact:", err);
    res.status(500).json({ error: "Server error" });
  }
};
// OPTIONAL: Admin can fetch all messages
const getallcontact = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// delete contact by ID (only admin)
const deletecontact = async (req, res) => {
  try {
    const { Id } = req.params;

    // check if contact exists
    const contact = await Contact.findById(Id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    // delete the contact
    await Contact.findByIdAndDelete(Id);

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting contact:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addcontact, getallcontact,deletecontact};
