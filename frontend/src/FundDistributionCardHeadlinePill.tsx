import {
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

function FundDistributionCardHeadlinePill() {
    return (
        <Text
            fontSize={'md'}
            fontWeight={500}
            bg={useColorModeValue('green.50', 'green.900')}
            p={2}
            px={3}
            color={'green.500'}
            rounded={'full'}>
            Your JIP Reward
        </Text>
    );
}

export default FundDistributionCardHeadlinePill;