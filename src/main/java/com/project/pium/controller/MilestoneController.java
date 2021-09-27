package com.project.pium.controller;

import com.project.pium.domain.MilestoneDTO;
import com.project.pium.service.MemberService;
import com.project.pium.service.MilestoneService;
import com.project.pium.service.ProjectmemberService;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;


@Log
@RestController
@AllArgsConstructor
@ResponseBody
public class MilestoneController {

    private MilestoneService milestoneService;
    private MemberService memberService;
    private ProjectmemberService projectmemberService;

    //현재 로그인한 유저의 세션값 얻어오는 로직 모듈화
    public String currentUserName(Principal principal){
        if(principal ==null){
            return "false";
        }else{
            String sessionEmail = principal.getName();
            return sessionEmail;
        }
    }

    //마일스톤 생성하기
    @PostMapping("/ajax/createMileStone")
    public String createMile(@RequestBody MilestoneDTO milestoneDTO, Principal principal){
        log.info("#milestoneDTO : "+milestoneDTO);
        long projSeq= milestoneDTO.getProject_seq();

        //1. 접속한 유저 이메일로 memberSeq 찾음
        String email= currentUserName(principal);
        long sessionSeq = memberService.findUserNo(email);

        //2. projectSeq와 memberSeq로 project_member seq 찾음
        long projMemberSeq = projectmemberService.findProjMemberSeq(projSeq,sessionSeq);
        milestoneDTO.setProjmember_seq(projMemberSeq);
        milestoneService.createMile(milestoneDTO);
        return "success";
    }
    

    //해당 프로젝트에서 생성된 전체 마일스톤 리스트 보여주기
    @GetMapping("/ajax/{projSeq}/milestonelist")
    public List<MilestoneDTO> msList(@PathVariable long projSeq){
        List<MilestoneDTO> milestoneList = milestoneService.msListBySeq(projSeq);
        log.info("list" + milestoneList);
        return milestoneList;
    }
    
    //마일스톤 눌러서 들어갔을 때 나오는 마일스톤 상세정보 보여주기
    @GetMapping("/ajax/milestone/{mileSeq}")
    public List<MilestoneDTO> msListDesc(@PathVariable long mileSeq){
        List<MilestoneDTO> listBy = milestoneService.selectByMsSeq(mileSeq);
        log.info("listBy" + listBy);
        return listBy;
    }

    //마일스톤 수정(제목,설명,달력)
    @PostMapping("/ajax/updateMileStone")
    public void updateMileStone(@RequestBody MilestoneDTO milestoneDTO, Principal principal){
        log.info("#milestoneDTO : "+milestoneDTO);
        //구현중..
    }

    // 마일스톤 완료상태로 전환
    @ResponseBody
    @PostMapping("/ajax/closeMileStone")
    public void closeMileStone(@RequestBody Map<String,Integer> param){
        Long mileSeq= Long.valueOf(param.get("milestone_seq"));
    }

    // 마일스톤 오픈상태로 전환
    @ResponseBody
    @PostMapping("/ajax/openMileStone")
    public void openMileStone(@RequestBody Map<String,Integer> param){
        Long mileSeq= Long.valueOf(param.get("milestone_seq"));
    }


    // 마일스톤 삭제상태로 전환
    @ResponseBody
    @PostMapping("/ajax/deleteMileStone")
    public void deleteMileStone(@RequestBody Map<String,Integer> param){
        Long mileSeq= Long.valueOf(param.get("milestone_seq"));
    }






























    @GetMapping(value="proMname/{prjMSeq}")
    public String proMnameByMseq(@PathVariable long prjMSeq){
        String pMname = milestoneService.projMnameByMseq(prjMSeq);
        log.info("pMname" + pMname);
        return  pMname;
    }
    //http://localhost:8000/mile/proMname/1 호출 성공

    @DeleteMapping("delete/{mileSeq}")
    public void delMile(@PathVariable long mileSeq){
        milestoneService.delMile(mileSeq);
    }

    //http://localhost:8000/mile/delete/11



    //  제목 변경
    @PutMapping("upMsName")
    public void upMsName(@RequestBody MilestoneDTO milestoneDTO){
        milestoneService.upMsName(milestoneDTO);
    }
    /*at Talend API Tester
      method : put
      url : http://localhost:8000/mile/upMsName
      {"milestone_title":"마일스톤 RE1","milestone_seq":1}
    */

    //내용 변경
    @PutMapping("upMsContent")
    public void upMsContent(@RequestBody MilestoneDTO milestoneDTO){
        milestoneService.upMsContent(milestoneDTO);
    }
     /*at Talend API Tester
      method : put
      url : http://localhost:8000/mile/upMsContent
      {"milestone_content":"RE 마일스톤 1 내용","milestone_seq":1}
    */

    //isdel
    @PutMapping("upMsIsdel")
    public void upMsIsdel(@RequestBody MilestoneDTO milestoneDTO){
        milestoneService.upMsIsdel(milestoneDTO);
    }
     /*at Talend API Tester
      method : put
      url : http://localhost:8000/mile/upMsIsdel
      {"milestone_isdelete":1,"milestone_seq":1}
    */
}
