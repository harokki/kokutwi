import React, { useState } from 'react';
import { NextPage } from 'next';
import { Tweet } from 'react-twitter-widgets';
import { Flex, Box, Heading, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import Calendar from 'react-calendar';
import { format } from 'date-fns';

import { getKokutweets } from 'domains/firebase/services/get-kokutweet';
import { Loading } from 'ui-parts/loading';

const Index: NextPage = () => {
  const now = new Date();
  const [calendarValue, onChangeCalendarValue] = useState(now);
  const [tweetIdPath, setTweetIdPath] = useState(
    `${format(now, 'yyyyMM')}/${format(now, 'dd')}`,
  );
  const { data: kokutweets } = useSWR(
    `public/v1/kokutwi/${tweetIdPath}`,
    getKokutweets,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return (
    <>
      <Flex>
        <Box p="2">
          <Heading size="md">Kokutwi</Heading>
        </Box>
        {/* ログイン機能実装までコメントアウト */}
        {/* <Spacer />
        <Box>
          <Button colorScheme="teal">Log in</Button>
        </Box> */}
      </Flex>
      <Flex justifyContent="center" mt={10}>
        <Box mr={10}>
          <Calendar
            locale="ja-JP"
            calendarType="US"
            onChange={onChangeCalendarValue}
            value={calendarValue}
            onClickDay={(value) => {
              const date = new Date(value);
              setTweetIdPath(`${format(date, 'yyyyMM')}/${format(date, 'dd')}`);
            }}
          />
        </Box>
        <Box maxHeight={500} w={410} overflowY="scroll">
          {/* eslint-disable-next-line no-nested-ternary */}
          {!kokutweets ? (
            <Loading />
          ) : kokutweets.length > 0 ? (
            kokutweets.map((kokutweet) => (
              <Tweet
                key={kokutweet}
                tweetId={kokutweet}
                options={{ width: '400' }}
              />
            ))
          ) : (
            <Text>告知がありません</Text>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default Index;
