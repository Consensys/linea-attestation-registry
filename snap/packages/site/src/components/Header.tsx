import {useContext} from 'react';
import styled, {useTheme} from 'styled-components';
import {MetamaskActions, MetaMaskContext} from '../hooks';
import {connectSnap, getSnap, getThemePreference} from '../utils';
import {HeaderButtons} from './Buttons';
import {Toggle} from './Toggle';
import veraxLogo from '../assets/verax-logo-circle.svg';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2.4rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.default};
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 1.2rem;

  ${({theme}) => theme.mediaQueries.small} {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Header = ({
                           handleToggleClick,
                       }: {
    handleToggleClick(): void;
}) => {
    const theme = useTheme();
    const [state, dispatch] = useContext(MetaMaskContext);

    const handleConnectClick = async () => {
        try {
            await connectSnap();
            const installedSnap = await getSnap();

            dispatch({
                type: MetamaskActions.SetInstalled,
                payload: installedSnap,
            });
        } catch (e) {
            console.error(e);
            dispatch({type: MetamaskActions.SetError, payload: e});
        }
    };
    return (
        <HeaderWrapper>
            <LogoWrapper>
                <img width={36} height={36} src={veraxLogo} alt={'Verax Logo'}/>
                <Title>Verax Checker</Title>
            </LogoWrapper>
            <RightContainer>
                <Toggle
                    onToggle={handleToggleClick}
                    defaultChecked={getThemePreference()}
                />
                <HeaderButtons state={state} onConnectClick={handleConnectClick}/>
            </RightContainer>
        </HeaderWrapper>
    );
};
