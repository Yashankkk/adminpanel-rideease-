import { useState } from 'react';
import axios from 'axios';
import { Button, Input, Select, Divider, message } from 'antd';

const { Option } = Select;

export default function CarRental() {
  const [imageUrl, setImageUrl] = useState('');
  const [specInput, setSpecInput] = useState('');
  const [specs, setSpecs] = useState([]);
  const [carmodel, setCarmodel] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('May 01, 2025');
  const [returnDate, setReturnDate] = useState('May 01, 2025');
  const [pickupTime, setPickupTime] = useState('');
  const [returnTime, setReturnTime] = useState('');

  const handleBookNow = async () => {
    if (!carmodel || !pickupLocation || !dropoffLocation || !pricePerDay ) {
      return message.error('Please fill in all required fields.');
    }

  const formData = new FormData();
  formData.append('carmodel', carmodel);
  formData.append('pickupLocation', pickupLocation);
  formData.append('dropoffLocation', dropoffLocation);
  formData.append('pickupDate', pickupDate);
  formData.append('returnDate', returnDate);
  formData.append('pickupTime', pickupTime);
  formData.append('returnTime', returnTime);
  formData.append('pricePerDay', pricePerDay);
  specs.forEach((spec, index) => formData.append(`specs[${index}]`, spec));


    try {
    const response = await axios.post(
      'http://localhost:3000/api/auth/bookings',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('Booking Successful:', response.data);
    alert('Booking successful!');
  } catch (error) {
    console.error('Booking error:', error);
    alert('An error occurred while booking.');
  }
};

  return (
    <div>
      <div className="bg-white !p-6 rounded-lg shadow-md w-full max-w-md lg:sticky lg:top-10">
        <h2 className="text-xl font-bold !mb-4">Register a Car</h2>

        <div className="!mb-4">
          <label className="block !mb-1 text-gray-700">Car Model</label>
          <Input
            placeholder="Enter car model"
            value={carmodel}
            onChange={(e) => setCarmodel(e.target.value)}
          />
        </div>

        <div className="!mb-4">
          <label className="block !mb-1 text-gray-700">Price Per Day</label>
          <Input
            type="number"
            placeholder="Enter price"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
          />
        </div>

        <div className="!mb-4">
          <label className="block !mb-1 text-gray-700">Specifications</label>
          <div className="flex gap-2 !mb-2">
            <Input
            placeholder="e.g. Automatic"
            value={specInput}
            onChange={(e) => setSpecInput(e.target.value)}
            />
            <Button
            onClick={() => {
              if (specInput.trim()) {
                setSpecs([...specs, specInput.trim()]);
                setSpecInput('');
              }
            }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {specs.map((spec, index) => (
              <span key={index} className="bg-gray-200 !px-2 !py-1 rounded">
                {spec}
              </span>
            ))}
          </div>
          </div>

   <div className="mb-4">
  <label className="block mb-1 text-gray-700">Car Image URL</label>
  <Input
    type="text"
    placeholder="https://example.com/car-image.jpg"
    value={imageUrl}
    onChange={(e) => setImageUrl(e.target.value)}
  />
</div>


        <div className="!mb-4">
          <label className="block !mb-1 text-gray-700">Pick Up Location</label>
          <Input
            placeholder="Enter pickup location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          />
        </div>

        <div className="!mb-4">
          <label className="block !mb-1 text-gray-700">Drop Off Location</label>
          <Input
            placeholder="Enter dropoff location"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
          />
        </div>

        <div className="!mb-4">
          <label className="block !mb-1 text-gray-700">Pick Up Date & Time</label>
          <div className="flex gap-2">
            <Input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-1/2"
            />
            <Select
              defaultValue="Time"
              className="w-1/2"
              onChange={(value) => setPickupTime(value)}
            >
              <Option value="9:00 AM">9:00 AM</Option>
              <Option value="12:00 PM">12:00 PM</Option>
              <Option value="3:00 PM">3:00 PM</Option>
              <Option value="6:00 PM">6:00 PM</Option>
            </Select>
          </div>
        </div>

        <div className="!mb-6">
          <label className="block !mb-1 text-gray-700">Return Date & Time</label>
          <div className="flex gap-2">
            <Input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-1/2"
            />
            <Select
              defaultValue="Time"
              className="w-1/2"
              onChange={(value) => setReturnTime(value)}
            >
              <Option value="9:00 AM">9:00 AM</Option>
              <Option value="12:00 PM">12:00 PM</Option>
              <Option value="3:00 PM">3:00 PM</Option>
              <Option value="6:00 PM">6:00 PM</Option>
            </Select>
          </div>
        </div>

        <Button type="primary" className="w-full" size="large" onClick={handleBookNow}>
          Book Now
        </Button>

        <Divider />
      </div>
    </div>
  );
}
