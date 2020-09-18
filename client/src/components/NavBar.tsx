import { Box, Button, Flex, Link } from '@chakra-ui/core'
import React from 'react'
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from '../generated/graphql'


interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({ }) => {

    const [{ data, fetching }] = useMeQuery()
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
    let body = null
    if (fetching) {

    } else if (!data?.me) {
        // Not logged in
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={2}>Login</Link></NextLink>
                <NextLink href="/register">
                    <Link>Register</Link>
                </NextLink>

            </>
        )
    } else {
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button onClick={() => logout()} isLoading={logoutFetching} variant="link">Logout</Button>
            </Flex>
        )
    }


    return (
        <Flex bg="tan" p={4}>
            <Box ml="auto">
                {body}
            </Box>
        </Flex>
    )
}
export default NavBar