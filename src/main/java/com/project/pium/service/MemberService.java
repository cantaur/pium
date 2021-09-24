package com.project.pium.service;

import com.project.pium.domain.MemberDTO;
import java.util.List;

public interface MemberService {
    List<MemberDTO> selectAll();
    String findUserEmail(String mEmail);
    List<MemberDTO> selectAllByEmail(String mEmail);
    List<MemberDTO> selectAllByMseq(long mSEQ);
    int findUserNo(String id);



    void deleteUser(long mSEQ);
}
