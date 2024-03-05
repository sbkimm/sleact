import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { FC, useState } from "react";
import { Redirect } from "react-router";
import useSWR from "swr";
import { Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceButton, WorkspaceModal, WorkspaceName, WorkspaceWrapper, Workspaces } from "./styles";
import gravatar from "gravatar";
import Menu from "@components/Menu";
import { Link } from "react-router-dom";

const Workspace: FC = ({children}) => {
    const { data: userData, error, mutate } = useSWR('/api/users', fetcher);
    const [ showUserMenu, setShowUserMenu ] = useState(false);
    
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

    const onClickUserProfile = () => {
      setShowUserMenu((prev) => !prev);
    }

    const onClickUserProfile2 = () => {
      setShowUserMenu((prev) => !prev);
      console.log('test');
    }

    if(!userData)
    {
        return <Redirect to="/login" />;
    }
    
    return (
        <div>
            <Header>
              <RightMenu>
                <span onClick={onClickUserProfile2}>
                  <ProfileImg src={gravatar.url(userData.nickname, {s: '28px', d: 'retro'})} alt={userData.nickname}/>
                  {showUserMenu && (
                    <Menu style={{right:0, top:38}} onCloseModal={onClickUserProfile}>
                      <ProfileModal>
                        <img src={gravatar.url(userData.nickname, {s: '36px', d: 'retro'})} alt={userData.nickname} />
                        <div>
                          <span id="profile-name">{userData.ninckname}</span>
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
                {userData.Workspace.map((ws)=> {
                    return (
                      <Link key={ws.id} to={`/workspaces/${123}/channel/일반`}>
                        <WorkspaceButton>{ws.name.splice(0, 1).toUpperCase()}</WorkspaceButton>
                      </Link>
                    )
                })}
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
        </div>
    )
}

export default Workspace;