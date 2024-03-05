import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { FC, useState } from "react";
import { Redirect } from "react-router";
import useSWR from "swr";
import { Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceModal, WorkspaceName, WorkspaceWrapper, Workspaces } from "./styles";
import gravatar from "gravatar";
import Menu from "@components/Menu";

const Workspace: FC = ({children}) => {
    const { data, error, mutate } = useSWR('/api/users', fetcher);
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

    if(!data)
    {
        return <Redirect to="/login" />;
    }
    
    return (
        <div>
            <Header>
              <RightMenu>
                <span onClick={onClickUserProfile}>
                  <ProfileImg src={gravatar.url(data.nickname, {s: '28px', d: 'retro'})} alt={data.nickname}/>
                  {showUserMenu && (
                    <Menu style={{right:0, top:38}} onCloseModal={onClickUserProfile}>
                      <ProfileModal>
                        <img src={gravatar.url(data.nickname, {s: '36px', d: 'retro'})} alt={data.nickname} />
                        <div>
                          <span id="profile-name">{data.ninckname}</span>
                          <span id="profile-active">Active</span>
                        </div>
                      </ProfileModal>
                      <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                    </Menu>
                  )}
                </span>
              </RightMenu>
            </Header>
            <button onClick={onLogout}>로그아웃</button>
            <WorkspaceWrapper>
              <Workspaces>
                test
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