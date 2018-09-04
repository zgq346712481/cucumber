import * as React from "react";
import styled from 'styled-components';
import GherkinDocument from "./WrappedGherkinDocument";
import DocumentList from "./DocumentList";
import Button from '@material-ui/core/Button';

const Container = styled.div`
  height: 100%;
  overflow: hidden;
  margin: 0;
  display: flex;
  font-family: Roboto;
`

const Column = styled.div`
  height: 100%;  /*allows both columns to span the full height of the browser window*/
  display: flex;
  flex-direction: column;  /*places the left and right headers above the bottom content*/
`

const LeftColumn = styled(Column)`
  flex-shrink: 0;  /*makes sure that content is not cut off in a smaller browser window*/
  background-color: #072a80;
  color: white;
`

const RightColumn = styled(Column)`
  flex-grow: 1;
  background-color: #f3f3f3;
`

const TopLeft = styled.div`
  flex-shrink: 0;
  background-color: #333;
  color: white;
  padding: 20px;
`

const TopRight = styled.div`
  display: inline-flex;
  flex-shrink: 0;
  background-color: #333;
  color: white;
  padding: 20px;
`

const Bottom = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
`

const Menu = styled.ul`
  display: inline-flex;
  list-style: none;
  margin: 0;
`

const MenuItem = styled.li`
  margin-right: 20px;
`

export interface CucumberGuiProps {
}

// https://www.bitovi.com/blog/use-flexbox-to-create-a-sticky-header-and-sidebar-with-flexible-content
// http://jsbin.com/qusudim/edit?html,css,output
// https://codepen.io/machonky/pen/epGNWO (maybe fix the width?)
export const CucumberGui: React.SFC<CucumberGuiProps> = () => {
    return <Container>
        <LeftColumn>
            <TopLeft>
                <Button variant="contained" color="primary">
                    Hello World
                </Button>
            </TopLeft>
            <Bottom>
                <DocumentList/>
            </Bottom>
        </LeftColumn>
        <RightColumn>
            <TopRight>
                <Menu>
                    <MenuItem>one</MenuItem>
                    <MenuItem>two</MenuItem>
                    <MenuItem>three</MenuItem>
                    <MenuItem>four</MenuItem>
                </Menu>
            </TopRight>
            <Bottom>
                <GherkinDocument/>
            </Bottom>
        </RightColumn>
    </Container>
}
