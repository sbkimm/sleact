import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { FC, useCallback, useState } from "react";
import { Redirect } from "react-router";
import useSWR from "swr";
import { AddButton, Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceButton, WorkspaceModal, WorkspaceName, WorkspaceWrapper, Workspaces } from "./styles";
import gravatar from "gravatar";
import Menu from "@components/Menu";
import { Link } from "react-router-dom";
import { IUser, IWorkspace } from "@typings/db";
import useInput from "@hooks/useInput";
import Modal from "@components/Modal";
import { Button, Input, Label } from "@pages/SignUp/styles";
import { toast } from "react-toastify";

const Workspace: FC = ({children}) => {
    const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
    const [ showUserMenu, setShowUserMenu ] = useState(false);
    const [ showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [ newWorkspace, onChangeNewWorkspace, setNewWorkspace ] = useInput('');
    const [ newUrl, onChangeNewUrl, setNewUrl ] = useInput('');

    
    const onLogout = () => {
        axios
        .post(
          '/api/users/logout', null,
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          mutate(false, false);
        })
    }

    const onClickUserProfile = useCallback(() => {
      setShowUserMenu((prev) => !prev);
    },[]);

    const onCloseUserProfile = useCallback((e) => {
      e.stopPropagation();
      setShowUserMenu(false);
    }, []);
    
    const onClickCreateWrokspace = useCallback(() => {
      setShowCreateWorkspaceModal(true);
    }, []);

    const onCloseModal = useCallback(() => {
      setShowCreateWorkspaceModal(false);
    }, []);


    const onCreateWorkspace = useCallback((e) => {
      e.preventDefault();
      if(!newWorkspace || !newWorkspace.trim()) return;
      if(!newUrl || !newUrl.trim()) return;

      axios.post('/api/workspaces', {
        workspace: newWorkspace,
        url: newUrl
      },{
        withCredentials: true
      })
      .then(() => {
        mutate();
        setShowCreateWorkspaceModal(false);
        setNewWorkspace('');
        setNewUrl('');
      })
      .catch((error) => {
        toast.error(error.response.data, {position: 'bottom-center'})
      });

    }, [newWorkspace, newUrl]);


    if(!userData)
    {
        return <Redirect to="/login" />;
    }

    return (
        <div>
            <Header>
              <RightMenu>
                <span onClick={onClickUserProfile}>
                  <ProfileImg src={gravatar.url(userData.nickname, {s: '28px', d: 'retro'})} alt={userData.nickname}/>
                  {showUserMenu && (
                    <Menu style={{right:0, top:38}} onCloseModal={onCloseUserProfile}>
                      <ProfileModal>
                        <img src={gravatar.url(userData.nickname, {s: '36px', d: 'retro'})} alt={userData.nickname} />
                        <div>
                          <span id="profile-name">{userData.nickname}</span>
                          <span id="profile-active">Active</span>
                        </div>
                      </ProfileModal>
                      <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                    </Menu>
                  )}
                </span>
              </RightMenu>
            </Header>
            <WorkspaceWrapper>
              <Workspaces>
                {userData.Workspaces.map((ws)=> {
                    return (
                      <Link key={ws.id} to={`/workspaces/${123}/channel/일반`}>
                        <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                      </Link>
                    )
                })}
                <AddButton onClick={onClickCreateWrokspace}>+</AddButton>
              </Workspaces>
              <Channels>
                <WorkspaceName>
                  Sleact
                </WorkspaceName>
                <MenuScroll>
                  menu scroll
                </MenuScroll>
              </Channels>
              <Chats>
                {children}
              </Chats>
            </WorkspaceWrapper>
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <form onSubmit={onCreateWorkspace}>
                  <Label id="workspace-label">
                    <span>워크스페이스 이름</span>
                    <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}></Input>
                  </Label>
                  <Label id="workspace-url-label">
                  <span>워크스페이스 url</span>
                  <Input id="workspace" value={newUrl} onChange={onChangeNewUrl}></Input>
                  </Label>
                  <Button type="submit">생성하기</Button>
                </form>
            </Modal>
        </div>
    )
}

export default Workspace;