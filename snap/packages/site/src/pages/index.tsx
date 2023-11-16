import {useContext} from 'react';
import styled from 'styled-components';
import {MetamaskActions, MetaMaskContext} from '../hooks';
import {connectSnap, getSnap, isLocalSnap, sendHello, sendTx, shouldDisplayReconnectButton,} from '../utils';
import {Card, ConnectButton, InstallFlaskButton, ReconnectButton, SendTxButton,} from '../components';
import {defaultSnapOrigin} from '../config';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;

  ${({theme}) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({theme}) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;

  ${({theme}) => theme.mediaQueries.small} {
    font-size: ${({theme}) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({theme}) => theme.colors.background.alternative};
  border: 1px solid ${({theme}) => theme.colors.border.default};
  color: ${({theme}) => theme.colors.text.alternative};
  border-radius: ${({theme}) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }

  ${({theme}) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({theme}) => theme.colors.error.muted};
  border: 1px solid ${({theme}) => theme.colors.error.default};
  color: ${({theme}) => theme.colors.error.alternative};
  border-radius: ${({theme}) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  ${({theme}) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
    const [state, dispatch] = useContext(MetaMaskContext);

    const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
        ? state.isFlask
        : state.snapsDetected;

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

    const handleSendHelloClick = async () => {
        try {
            await sendHello();
        } catch (e) {
            console.error(e);
            dispatch({type: MetamaskActions.SetError, payload: e});
        }
    };

    const handleSendTxClick = async (to: string) => {
        try {
            await sendTx(to);
        } catch (e) {
            console.error(e);
            dispatch({type: MetamaskActions.SetError, payload: e});
        }
    };

    return (
        <Container>
            <Heading>
                Welcome to <Span>Verax Checker</Span>
            </Heading>
            <Subtitle>
                Easily check the attestations issued to the recipients of your transactions
            </Subtitle>
            <CardContainer>
                {state.error && (
                    <ErrorMessage>
                        <b>An error happened:</b> {state.error.message}
                    </ErrorMessage>
                )}
                {!isMetaMaskReady && (
                    <Card
                        content={{
                            title: 'Install',
                            description:
                                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
                            button: <InstallFlaskButton/>,
                        }}
                        fullWidth
                    />
                )}
                {!state.installedSnap && (
                    <Card
                        content={{
                            title: 'Connect',
                            description:
                                'Get started by connecting to and installing the example snap.',
                            button: (
                                <ConnectButton
                                    onClick={handleConnectClick}
                                    disabled={!isMetaMaskReady}
                                />
                            ),
                        }}
                        disabled={!isMetaMaskReady}
                    />
                )}
                {shouldDisplayReconnectButton(state.installedSnap) && (
                    <Card
                        content={{
                            title: 'Reconnect',
                            description:
                                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
                            button: (
                                <ReconnectButton
                                    onClick={handleConnectClick}
                                    disabled={!state.installedSnap}
                                />
                            ),
                        }}
                        disabled={!state.installedSnap}
                    />
                )}
                <Card
                    content={{
                        title: 'Send a Transaction',
                        description:
                            'Kindly send 0.1 ETH to 0xF68...6F8A.',
                        button: (
                            <SendTxButton
                                onClick={() => handleSendTxClick('0xF68DE11960197Be1C2125c728A6578C7297a6F8A')}
                                disabled={!state.installedSnap}
                            />
                        ),
                    }}
                    disabled={!state.installedSnap}
                    fullWidth={
                        isMetaMaskReady &&
                        Boolean(state.installedSnap) &&
                        !shouldDisplayReconnectButton(state.installedSnap)
                    }
                />
                <Notice>
                    <p>
                        When the transaction popup appears, click on the <b>Verax Checker tab</b> to get insights about
                        the recipient's attestations.
                    </p>
                </Notice>
            </CardContainer>
        </Container>
    );
};

export default Index;
