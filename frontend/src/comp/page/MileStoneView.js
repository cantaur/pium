import axios from "axios";
import React, { useEffect, useState,useCallback } from "react"
import {pub, colors, pages, seqColorTrans, host} from '../Helper.js'
import DatePicker from '../DatePicker.js'
import StoneList from "./comp/StoneList.js";

import {FloatingLabel, Form, Button, Dropdown, Alert, Modal} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory } from "react-router-dom";
import {connect} from 'react-redux';
import NonePage from "../NonePage.js";



function MileStoneView(p){
  const params = useParams();
  const history = useHistory();
  const mileStoneSeq = params.pageSeq;

  //마일스톤 정보
  const [mileStoneInfo, mileStoneInfoCng] = useState();


  let dateModalClose =useCallback((e)=>{
    if(!e.target.closest('.DayPicker_1') ){
      
      p.dispatch({type:'modalOff'})
      setTimeout(()=>{
        window.removeEventListener('click', dateModalClose)
      })
    }
  },[])

  const mileStoneUpdate = (info) =>{
    p.dispatch({type:'loadingOn'})

    axios.post(host+'/ajax/updateMileStone', info)
    .then(r=>{
      axios.get(host+'/ajax/milestone/'+mileStoneSeq)
      .then(r=>{
        // console.log(r.data)
        
        mileStoneInfoCng(r.data)
        
        p.dispatch({type:'loadingOff'})
      })
      .catch(e=>{
        console.log(e)
        p.dispatch({type:'loadingOff'})
      })

    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })
  }

  const mileStoneDateNull = () =>{
    p.dispatch({type:'loadingOn'})

    axios.get(host+'/ajax/setDateEmpty/'+mileStoneSeq)
    .then(r=>{
      axios.get(host+'/ajax/milestone/'+mileStoneSeq)
      .then(r=>{
        // console.log(r.data)
        
        mileStoneInfoCng(r.data)
        
        p.dispatch({type:'loadingOff'})
      })
      .catch(e=>{
        console.log(e)
        p.dispatch({type:'loadingOff'})
      })

    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })
  }

  useEffect(()=>{
    p.dispatch({type:'loadingOn'})
    axios.get(host+'/ajax/milestone/'+mileStoneSeq)
    .then(r=>{
      // console.log(r.data)
      mileStoneInfoCng(r.data)
      p.dispatch({type:'loadingOff'})
    })
    .catch(e=>{
      console.log(e)
      p.dispatch({type:'loadingOff'})
    })
  },[])

  return(
    <div className="pageContentWrap mileStoneWrap">
      

      <div className="stoneListWrap">
        {
          mileStoneInfo &&
          <>
            <StoneList 
              prjSeq={p.prjSeq}
              milestone_seq={1}
              milestone_title={mileStoneInfo.milestone_title}
              milestone_content={mileStoneInfo.milestone_content}
              color={seqColorTrans(mileStoneInfo.milestone_seq)} 
              
              completeTaskCnt={1}
              taskCnt={2}
              milestone_startdate={mileStoneInfo.milestone_startdate}
              milestone_duedate={mileStoneInfo.milestone_duedate}
              isView={true}
              dateModalClose={dateModalClose}
              mileStoneInfoCng={mileStoneInfoCng}
              mileStoneInfo={mileStoneInfo}
              mileStoneUpdate={mileStoneUpdate}
              mileStoneDateNull={mileStoneDateNull}
            />
            <div className="mileStoneTaskWrap">
              <div className="taskHeader">
                <div className="filter">
                  <p className="on">전체</p>
                  <p>진행중</p>
                  <p>종료</p>
                </div>
                <div className="sort">
                  <p className="sortBtn">담당자 <i class="fas fa-caret-down"></i></p>
                  <p className="sortBtn">중요도 <i class="fas fa-caret-down"></i></p>
                  <p className="sortBtn">라벨 <i class="fas fa-caret-down"></i></p>
                  <p className="sortBtn">작성자 <i class="fas fa-caret-down"></i></p>
                </div>
              </div>

              <div className="taskList">
                <div className="taskRow">
                  <p className="title"></p>
                  <div className="infoWrap">
                    <div className="profileWrap">
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
        
        
        

      


      </div>

    </div>
  )
}


function transReducer(state){
  return {
    datePickerModal : state.datePickerModal,
  }
}

export default connect(transReducer)(MileStoneView);