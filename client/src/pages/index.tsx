import { withUrqlClient } from 'next-urql'
import NavBar from "../components/NavBar"
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'


const Index = () => {
    const [{ data }] = usePostsQuery()
    const queries = data ? data.posts.map(p => <div>{p.title}</div>) : <div>Loading...</div>
    return (<>
        {queries}
        <NavBar />
    </>)
}

export default withUrqlClient(createUrqlClient)(Index)
