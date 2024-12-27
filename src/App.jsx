import { useRef, useReducer, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import { getEmotionImage } from "./util/get-emotion-image";

import Home from "./pages/Home";
import Diary from "./pages/Diary";
import New from "./pages/New";
import Edit from "./pages/Edit";
import NotFound from "./pages/NotFound";

import Button from "./components/Button";
import Header from "./components/Header";

//임시 데이터
const mockData = [
  {
    id: 1,
    createdDate: new Date("2024-12-22").getTime(),
    emotionId: 1,
    content: "1번 일기 내용",
  },
  {
    id: 2,
    createdDate: new Date("2024-12-21").getTime(),
    emotionId: 2,
    content: "2번 일기 내용",
  },
  {
    id: 3,
    createdDate: new Date("2024-11-30").getTime(),
    emotionId: 3,
    content: "3번 일기 내용",
  },
  {
    id: 4,
    createdDate: new Date("2024-11-29").getTime(),
    emotionId: 4,
    content: "4번 일기 내용",
  },
];

function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return [action.data, ...state]; //기존 데이터 맨 앞에 새롭게 추가
    case "UPDATE":
      return state.map(
        (item) =>
          String(item.id) === String(action.data.id) ? action.data : item //id 일치하는 데이터 덮어쓰기
      );
    case "DELETE":
      return state.filter((item) => String(item.id) !== String(action.id));

    default:
      return state;
  }
}

//데이터Context
export const DiaryStateContext = createContext();
//함수Context
export const DiaryDispatchContext = createContext();

function App() {
  //일기 데이터 저장 state
  const [data, dispatch] = useReducer(reducer, mockData);

  //일기 ID
  const id = useRef(5);

  //새로운 일기 추가
  const onCreate = (createdDate, emotionId, content) => {
    dispatch({
      type: "CREATE",
      data: {
        id: id.current++,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  //기존 일기 수정
  const onUpdate = (id, createdDate, emotionId, content) => {
    dispatch({
      type: "UPDATE",
      data: {
        id,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  //기존 일기 삭제
  const onDelete = (id) => {
    dispatch({
      type: "DELETE",
      id,
    });
  };

  return (
    <>
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={{ onCreate, onUpdate, onDelete }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<New />} />
            <Route path="/diary/:id" element={<Diary />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </>
  );
}

export default App;
