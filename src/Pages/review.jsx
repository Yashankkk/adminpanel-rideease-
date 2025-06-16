import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Rate, message } from 'antd';
import axios from 'axios';

const User = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/review`);
        const reviewsWithKeys = res.data.map((review) => ({ ...review, key: review._id }));
        setReviews(reviewsWithKeys);
      } catch (err) {
        message.error('Failed to load reviews');
      }
    };
    fetchReviews();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>User Reviews</h2>
      <Row gutter={[16, 16]}>
        {reviews.map((review) => (
          <Col key={review.key} xs={24} sm={12} md={8} lg={6}>
            <Card
              title={<Rate disabled defaultValue={review.rating} />}
              bordered={false}
              style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              <p>{review.feedback}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default User;
