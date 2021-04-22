import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components'

interface TabItem {
  id: string;
  name: string;
  content: React.ReactChild;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveId: string;
  onSelectTab?: (tabId: string) => void;
}

const TabsContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`

const TabsTitle = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`
const TabsTitleItem = styled.div<{isActiveTab: boolean}>`
  font-size: 13px;
  color: white;
  font-weight: bold;
  cursor: ${props => props.isActiveTab ? 'default' : 'pointer'};
  opacity: ${props => props.isActiveTab ? 1 : 0.4 };
  user-select: none;
  
  :not(:first-child) {
    margin-left: 16px;
  }
`

const TabsContent = styled.div`
  display: flex;
  justify-content: center;
`
const TabsContentItem = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'block' : 'none' };
`

export const Tabs = (props: TabsProps) => {
  const [activeTabId, setActiveTabId] = useState(props.defaultActiveId)

  const onTitleItemClicked = (id: string) => {
    setActiveTabId(id)
    if(props.onSelectTab) {
      props.onSelectTab(id)
    }
  }

  return <TabsContainer>
    <TabsTitle>
      {props.items.map(item => {
        const { id } = item
        const isActiveTab = id === activeTabId
        const onClick = !isActiveTab ? () => onTitleItemClicked(id) : undefined
        return <TabsTitleItem key={item.id} isActiveTab={isActiveTab} onClick={onClick}>{item.name}</TabsTitleItem>
      })}
    </TabsTitle>
    <TabsContent>
      {props.items.map(item => {
        return <TabsContentItem key={item.id} isVisible={item.id === activeTabId}>{item.content}</TabsContentItem>
      })}
    </TabsContent>
  </TabsContainer>
}
