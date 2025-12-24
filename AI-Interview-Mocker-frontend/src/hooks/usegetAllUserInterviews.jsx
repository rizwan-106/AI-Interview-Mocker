import { setAllUserInterviews } from '@/redux/slices/interviewSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { API_BASE_URL } from '@/utils/utils';

const usegetAllUserInterviews = (interviewResult) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllUserInterviews = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/interview/getUserInterviews`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setAllUserInterviews(res.data.interviews));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAllUserInterviews();
  }, [interviewResult]);
};

export default usegetAllUserInterviews
