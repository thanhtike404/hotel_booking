'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-5">
      <h1 className="text-2xl font-bold mb-4">Hotel Booking Contact Form</h1>

      {submitted ? (
        <p className="text-green-600">Thanks for contacting us!</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full border p-2" required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full border p-2" required />
          <input name="phone" type="tel" placeholder="Phone" onChange={handleChange} className="w-full border p-2" required />
          <input name="checkIn" type="date" onChange={handleChange} className="w-full border p-2" required />
          <input name="checkOut" type="date" onChange={handleChange} className="w-full border p-2" required />
          <input name="guests" type="number" min="1" onChange={handleChange} className="w-full border p-2" value={form.guests} required />
          <textarea name="message" placeholder="Additional message" onChange={handleChange} className="w-full border p-2" rows={4}></textarea>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
