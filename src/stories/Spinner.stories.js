import Spinner from '../Spinner';

export default {
    component: Spinner,
    title: 'mymy/Spinner',
};

const Template = (args) => <Spinner {...args} />;

export const Default = Template.bind({});
Default.args = {
};

export const DarkMode = Template.bind({});
DarkMode.args = {
    isDarkMode: true,
};
