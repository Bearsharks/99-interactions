import Navigation from '../Navigation';
import { useEffect } from 'react';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { isNavActive } from '../atoms/atoms'

function NavigationWrapper(props) {
    const setNavActive = useSetRecoilState(isNavActive);
    useEffect(() => {
        setNavActive(props.isActive);
    }, [setNavActive, props.isActive]);
    return (
        <Navigation />
    );
}
export default {
    component: NavigationWrapper,
    title: 'mymy/Navigation',
};

const Template = (args) => <RecoilRoot><NavigationWrapper {...args} /></RecoilRoot>;

export const Default = Template.bind({});
Default.args = {
    isActive: true
};

