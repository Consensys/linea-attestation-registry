import { useContext } from 'react';
import styled, { useTheme } from 'styled-components';

import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getSnap, getThemePreference } from '../utils';
import { HeaderButtons } from './Buttons';
import { SnapLogo } from './SnapLogo';
import { Toggle } from './Toggle';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2.4rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border?.default};
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 1.2rem;

  ${({ theme }) => theme.mediaQueries.small} {
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
  const { state, dispatch, provider } = useContext(MetaMaskContext);

  const handleConnectClick = async () => {
    try {
      // This function will only be triggerable if a provider is available
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await connectSnap(provider!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const installedSnap = await getSnap(provider!);

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };
  return (
    <HeaderWrapper>
      <LogoWrapper>
        <SnapLogo color={theme.colors.icon?.default} size={36} />
        <Title>Verax Checker Snap</Title>
      </LogoWrapper>
      <RightContainer>
        <Toggle
          onToggle={handleToggleClick}
          defaultChecked={getThemePreference()}
        />
        <HeaderButtons state={state} onConnectClick={handleConnectClick} />
      </RightContainer>
    </HeaderWrapper>
  );
};
