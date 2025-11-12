import {createSlice} from "@reduxjs/toolkit";

export const interviewSlice = createSlice({
  name: "interview",
  initialState: {
    questions: [],
    answers: [],
    interviewResult: [],
    allUserInterviews: [],
    singleInterview:null
  },
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    setAnswers: (state, action) => {
      state.answers = action.payload;
    },
    setInterviewResult: (state, action) => {
      state.interviewResult = action.payload;
    },

    setAllUserInterviews:(state, action)=>{
      state.allUserInterviews = action.payload;
    },

    setSingleInterview:(state, action)=>{
      state.singleInterview = action.payload;
    }

  },
});

export const {
  setQuestions,
  setAnswers,
  setInterviewResult,
  setAllUserInterviews,
  setSingleInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;
