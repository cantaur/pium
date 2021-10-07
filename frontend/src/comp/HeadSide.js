import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react"
import {pub, colors, host,axiosHelper} from './Helper.js'
import DatePicker from './DatePicker.js'
import {FloatingLabel, Form, Button, Dropdown, Alert, Modal, Row} from 'react-bootstrap'
import { Link, useParams, withRouter, useHistory, useLocation, NavLink } from "react-router-dom";
import {CSSTransition} from 'react-transition-group';
import {connect} from 'react-redux';




//페이지 정보 (왼쪽탭 활성화)
function pagePath(page){
  switch (page){
    case 'todo':
      return 0;
    case 'notice':
      return 0;
    case 'calendar':
      return 1;
    case 'projectChart':
      return 1;
    case 'fileList' :
      return 1;
    case 'mileStone':
      return 2;
    case 'mileStoneView':
      return 2;
    case 'task':
      return 3;
  }
}


function HeadSide(p){
  const history = useHistory();

  //검색 모달 상태
  let [searchModal, searchModalCng] = useState(false);
  const searchInput = useRef();

  const pagePathNum = pagePath(p.pageInfo);

  //멤버 설정 모달 상태
  let [memberModal, memberModalCng] = useState(false);

  // 멤버 설정 모달_바깥클릭시 닫기 이벤트 핸들러
  let memberModalClose =useCallback((e)=>{
    if(!e.target.closest('.memberModalWrap') && !e.target.closest('.modalWrap')){
      memberModalCng(false)
      inviteEmailCng('');
      inviteAlertCng(false)
      inviteAlert2Cng(false)
      setTimeout(()=>{
        window.removeEventListener('click', memberModalClose)
      })
    }
  },[])

  //프로필 설정 모달
  const [profileModal, profileModalCng] = useState(false);

  //프로필 설정 모달_바깥클릭시 닫기 이벤트 핸들러
  let profileModalClose =useCallback((e)=>{
    if(!e.target.closest('.profileModalWrap') && !e.target.closest('.modalWrap')){
      profileModalCng(false)
      setTimeout(()=>{
        window.removeEventListener('click', profileModalClose)
      })
    }
  },[])

  //초대할 이메일
  const [inviteEmail, inviteEmailCng] = useState();
  const [inviteAlert, inviteAlertCng] = useState(false);
  const [inviteAlert2, inviteAlert2Cng] = useState(false);


  //제외할 계정
  const [outMember, outMemberCng]=useState();
  
  const [outAlertModal, outAlertModalCng] = useState(false)
  const outAlertClose =()=>{ 
    outMemberCng('');
    outAlertModalCng(false)
  };
  
  //스스로 제외
  const [outAlertModal2, outAlertModalCng2] = useState(false)
  const outAlertClose2 =()=>{ 
    outMemberCng('');
    outAlertModalCng2(false)
  };

  //멤버목록 state
  const [memberList, memberListCng] = useState();

  useEffect(()=>{
    outMemberCng('');
    inviteAlertCng(false)
    inviteAlert2Cng(false)
  },[inviteEmail, p.memberList])

  useEffect(()=>{
    memberListCng(p.memberList)
  },[p.memberList])

  return(
    <>
      {/* 헤더 */}
      <div className="viewHead" style={{backgroundColor:p.prjColor+'07'}}>
        <div className="pathWrap">
          <Form.Select size="sm" onChange={(e)=>{
            history.push('/project/'+e.target.value+'/todo')
            p.dispatch({type:'pagePush', val:'todo'})
          }}>
            {
              p.projectList.map((r, i)=>{
                if(r.project_isdelete != '1'){
                  return(
                    <option value={r.project_seq} selected={r.project_seq==p.prjSeq?true:false}>
                      {r.project_title}
                    </option>
                  )
                }
              })
            }
          </Form.Select>
          {
            p.projectInfo.project_status == '1' &&
              <p className="isCompleted">완료된 프로젝트</p>
          }
        </div>
        <div className="rightWrap">
          <i class="fas fa-search searchBtn" onClick={()=>{
            searchModalCng(true)
            setTimeout(()=>{
              searchInput.current.focus()

            })

          }}></i>

          <Modal className="searchBox" show={searchModal} onHide={()=>{searchModalCng(false)}}>
            <Modal.Header>
              <i class="fas fa-search" style={{color:p.prjColor}}></i>
              <Form.Control type="text" placeholder="검색어를 입력해주세요." className="searchInput" ref={searchInput}/>
            </Modal.Header>
            <Modal.Body>
              <div className="result">
                <b style={{backgroundColor:p.prjColor}}>마일스톤</b>
                <p>검색결과로 나온 마일스톤 이름</p>
              </div>
              <div className="result">
                <b style={{backgroundColor:p.prjColor}}>업무</b>
                <p>검색결과로 나온 업무 이름</p>
              </div>
              <div className="result">
                <b style={{backgroundColor:p.prjColor}}>프로젝트</b>
                <p>검색결과로 나온 업무 이름</p>
              </div>
            </Modal.Body>

          </Modal>

          <div className="noticeWrap">
            <i class="far fa-bell"></i>
            <div className="bellCnt"></div>
          </div>
        </div>

        
      </div>



      {/* 사이드 */}
      <div className="viewSide" style={{backgroundColor:p.prjColor+'20'}}>
        <div className="prjIcon tipRightBox" style={{backgroundColor:p.prjColor}} onClick={()=>{
          history.push('/project')
        }}>
          {p.projectInfo.project_title.trim().substring(0,1)}
          <p className="tipRight r35">프로젝트 목록으로</p>
        </div>

        <div className="pageIconWrap">
          <i class={"fas fa-home tipRightBox " + (pagePathNum==0?'on':'')} style={{color:p.prjColor}} onClick={()=>{
            history.push('/project/'+p.prjSeq+'/todo')
            p.dispatch({type:'pagePush', val:'todo'});
          }}>
            <p className="tipRight">내 업무</p>
          </i>
          <i class={"fas fa-tachometer-alt tipRightBox " + (pagePathNum==1?'on':'')} style={{color:p.prjColor}} onClick={()=>{
            history.push('/project/'+p.prjSeq+'/calendar')
            p.dispatch({type:'pagePush', val:'calendar'});
          }}>
            <p className="tipRight">프로젝트</p>
          </i>

          <i class={"fas fa-flag tipRightBox " + (pagePathNum==2?'on':'')} style={{color:p.prjColor}} onClick={()=>{
            history.push('/project/'+p.prjSeq+'/mileStone')
            p.dispatch({type:'pagePush', val:'mileStone'});

          }}>
            <p className="tipRight">마일스톤</p>
          </i>
          <i class={"fas fa-briefcase tipRightBox "+ (pagePathNum==3?'on':'')} style={{color:p.prjColor}} onClick={()=>{
            history.push('/project/'+p.prjSeq+'/task')
            p.dispatch({type:'pagePush', val:'task'});

          }}>
            <p className="tipRight">업무</p>
          </i>
        </div>


        <div className="memberIconWrap">
          <div className={"memberIcon tipRightBox "+(memberModal?'off':'')} onClick={()=>{
            if(!memberModal){
              setTimeout(()=>{
                memberModalCng(true)
                window.addEventListener('click', memberModalClose)
              })
            }
          }}>
            
            <p className="tipRight r45">멤버 설정</p>
            <i class="fas fa-users" style={{color:p.prjColor}}></i>            
          </div>


          <div className="profile tipRightBox" onClick={()=>{
            if(!profileModal){
              setTimeout(()=>{
                profileModalCng(true)
                window.addEventListener('click', profileModalClose)
              })
            }
          }}>
            <p className="tipRight r45">프로필 설정</p>
            <div className="profileIcon">
              {
                p.myMemberInfo?
                  p.myMemberInfo.projmember_data?
                  <img src={'data:image;base64,'+p.myMemberInfo.projmember_data}/>
                  :<img src={pub.img+'defaultProfile.svg'}/>
                :<img src={pub.img+'defaultProfile.svg'}/>
              }
            </div>
        </div>

        </div>
        <div className={"memberModalWrap " + (memberModal?'on':'')}>
          {
            inviteAlert &&
              <div className="noneEmailAlert">가입되지 않은 이메일입니다.</div>
          }
          {
            inviteAlert2 &&
              <div className="noneEmailAlert">이미 참여중인 이메일입니다.</div>
          }
          <div className="inviteWrap">
            <input type="text" placeholder="초대할 이메일" onChange={(e)=>{
              inviteEmailCng(e.target.value)
              inviteAlertCng(false)
              inviteAlert2Cng(false)
            }} onKeyPress={e=>{
              if(e.key == 'Enter' && inviteEmail != ''){
                p.dispatch({type:'loadingOn'})
                axios.post(host+'/ajax/inviteProject',{
                  project_seq:p.prjSeq,
                  member_email:inviteEmail
                })
                .then(r=>{
                  if(r.data == 'fail'){
                    inviteAlert2Cng(false)
                    inviteAlertCng(true)
                    p.dispatch({type:'loadingOff'})

                  }else if(r.data == 'duplicated'){
                    inviteAlert2Cng(true)
                    inviteAlertCng(false)
                    p.dispatch({type:'loadingOff'})

                  }else {
                    axios.get('/ajax/allProjMembers/'+p.prjSeq)
                    .then(r=>{
                      memberListCng(r.data)
                      p.dispatch({type:'loadingOff'})
                    })
                    .catch(e=>{
                      console.log(e)
                      p.dispatch({type:'loadingOff'})
                    })
                  }
                })
                .catch(e=>{
                  console.log(e)
                  p.dispatch({type:'loadingOff'})
                })
              }
            }}/>
            <i class="fas fa-paper-plane" style={{color:p.prjColor}} onClick={()=>{
              if(inviteEmail != ''){
                p.dispatch({type:'loadingOn'})
                axios.post(host+'/ajax/inviteProject',{
                  project_seq:p.prjSeq,
                  member_email:inviteEmail
                })
                .then(r=>{
                  if(r.data == 'fail'){
                    inviteAlert2Cng(false)
                    inviteAlertCng(true)
                    p.dispatch({type:'loadingOff'})

                  }else if(r.data == 'duplicated'){
                    inviteAlert2Cng(true)
                    inviteAlertCng(false)
                    p.dispatch({type:'loadingOff'})

                  }else {
                    axios.get('/ajax/allProjMembers/'+p.prjSeq)
                    .then(r=>{
                      memberListCng(r.data)
                      p.dispatch({type:'loadingOff'})
                    })
                    .catch(e=>{
                      console.log(e)
                      p.dispatch({type:'loadingOff'})
                    })
                  }
                })
                .catch(e=>{
                  console.log(e)
                  p.dispatch({type:'loadingOff'})
                })
              }
            }}></i>
          </div>

          <p className="memberCnt">참여중인 멤버
            <b style={{color:p.prjColor}}>
              {
                memberList&&
                ' '+memberList.length
              }
            </b>
          </p>
          <div className="memberListWrap">
            {
              memberList&&
              memberList.map((r, i)=>{
                let src = r.projmember_data?'data:image;base64,'+r.projmember_data:'/img/defaultProfile.svg'
                let name = r.projmember_name?r.projmember_name:'#'+r.member_seq
                let isManager = r.projmember_type==0?true:false;
                
                return(
                  <>
                    <div className="memberList on">
                      <div className="profileImg">
                        <img src={src}/>
                      </div>
                      <div className="profileName">
                        {
                          isManager
                          ?<p className="name">&#x1F451; {name}</p>
                          :<p className="name">{name}</p>
                        }
                        <p className="email">{r.member_email}</p>
                      </div>
                      <div className="memberBtnWrap">
                        {
                          p.loginUser.seq != r.member_seq
                          ?
                            !isManager && p.isMaster
                              ?
                              <p className="admin" onClick={()=>{
                                p.dispatch({type:'loadingOn'})
                                axios.post('/ajax/masterUpdate',{
                                  project_seq:p.prjSeq,
                                  projmember_seq:r.projmember_seq
                                })
                                .then(r => {
                                  axios.get('/ajax/allProjMembers/'+p.prjSeq)
                                  .then(r=>{
                                    memberListCng(r.data)
                                    p.dispatch({type:'loadingOff'})
                                  })
                                  .catch(e=>{
                                    console.log(e)
                                    p.dispatch({type:'loadingOff'})
                                  })
                                })
                                .catch(e => {
                                  console.log(e)
                                  p.dispatch({type:'loadingOff'})
                                })
                              }}>관리자로</p>
                            :null
                          :
                            <p className="except" onClick={()=>{
                              outMemberCng({
                                email:r.member_email,
                                seq:r.projmember_seq
                              })
                              outAlertModalCng2(true)
                            }}>프로젝트에서 나가기</p>
                        }
                        {
                          p.isMaster && p.loginUser.seq != r.member_seq
                          ?
                            <p className="except" onClick={()=>{
                              outMemberCng({
                                email:r.member_email,
                                seq:r.projmember_seq
                              })
                              outAlertModalCng(true)
                            }}>제외</p>
                          :null
                        }
                      </div>
                    </div>
                  </>
                )
                
              })
            }

          </div>
        </div>
        
        <div className={"profileModalWrap "+ (profileModal?"on":"")}>
          <div className="infoWrap">
            <div className="profileImg">
              <img src={pub.img+'defaultProfile.svg'}/>
            </div>
            <div className="info">
              <p className="name">닉네임 <b>관리자</b></p>
              <p className="email">test@gmail.com</p>
            </div>
          </div>
          <div className="btnWrap">
            <p className="profileSetBtn" style={{backgroundColor:p.prjColor}} onClick={()=>{
              p.profileMsgCng(false)
              setTimeout(()=>{
                p.profileSetModalCng(true)
                profileModalCng(false)
                window.removeEventListener('click', profileModalClose)
              },300)
            }}>프로필 설정</p>
            <a href={host+'/logout'} className='logoutBtn'>로그아웃</a>
          </div>
          
        </div>
        {
          outMember &&
            <Modal show={outAlertModal} onHide={outAlertClose} className="modalWrap">
              <Modal.Header style={{borderBottom:0}}>
                <Modal.Title className="modalTitle" >정말 {outMember.email}님을 제외하시겠어요? &#x1f625;</Modal.Title>
              </Modal.Header>
              <Modal.Footer style={{borderTop:0}}>
                <Button variant="secondary" onClick={outAlertClose} style={{fontSize:'.8rem'}}>
                  취소
                </Button>
                <Button variant="danger" onClick={()=>{
                  p.dispatch({type:'loadingOn'})
                  axios.post(host+'/ajax/projectout',{
                    project_seq:p.prjSeq,
                    projmember_seq:outMember.seq
                  })
                  .then(r => {
                    axios.get('/ajax/allProjMembers/'+p.prjSeq)
                    .then(r=>{
                      memberListCng(r.data)
                      p.dispatch({type:'loadingOff'})
                      outAlertModalCng(false)
                    })
                    .catch(e=>{
                      console.log(e)
                      p.dispatch({type:'loadingOff'})
                    })
                  })
                  .catch(e => {
                    console.log(e)
                    p.dispatch({type:'loadingOff'})
                  })
                }} style={{fontSize:'.8rem'}}>
                  제외하기
                </Button>
              </Modal.Footer>
            </Modal>
        }
        {
          outMember &&
            <Modal show={outAlertModal2} onHide={outAlertClose2} className="modalWrap">
              <Modal.Header style={{borderBottom:0}}>
                <Modal.Title className="modalTitle" >정말 {p.projectInfo.project_title} 프로젝트에서 나가시겠어요? &#x1f625;</Modal.Title>
              </Modal.Header>
              <Modal.Footer style={{borderTop:0}}>
                <Button variant="secondary" onClick={outAlertClose2} style={{fontSize:'.8rem'}}>
                  취소
                </Button>
                <Button variant="danger" onClick={()=>{
                  p.dispatch({type:'loadingOn'})
                  axios.post(host+'/ajax/projectout',{
                    project_seq:p.prjSeq,
                    projmember_seq:outMember.seq
                  })
                  .then(r => {
                    axios.get('/ajax/allProjMembers/'+p.prjSeq)
                    .then(r=>{
                      memberListCng(r.data)
                      outAlertModalCng(false)
                      p.dispatch({type:'loadingOff'})
                      history.push('/project')
                    })
                    .catch(e=>{
                      console.log(e)
                      p.dispatch({type:'loadingOff'})
                    })
                  })
                  .catch(e => {
                    console.log(e)
                    p.dispatch({type:'loadingOff'})
                  })
                }} style={{fontSize:'.8rem'}}>
                  나가기
                </Button>
              </Modal.Footer>
            </Modal>
        }
        
      </div>
    </>
  )
}
function transReducer(state){
  return {
    loginUser:state.loginUser,
    pageInfo:state.pageInfo,
    projectList:state.projectList,
    projectInfo:state.projectInfo,
    memberList:state.memberList,
    myMemberInfo:state.myMemberInfo,
    isMaster:state.isMaster,
    isProfileEmpty:state.isProfileEmpty
  }
}

export default connect(transReducer)(HeadSide);