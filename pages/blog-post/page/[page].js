import React from 'react'
import Head from 'next/head'

import { DataProvider, Repeater } from '@teleporthq/react-components'
import PropTypes from 'prop-types'
import {
  getEntities,
  getEntitiesWithPagination,
} from '@teleporthq/cms-mappers/caisy'

const BlogPost11 = (props) => {
  return (
    <>
      <div className="blog-post11-container">
        <Head>
          <title>BlogPost1 - Principal Accountability Producer</title>
          <meta
            property="og:title"
            content="BlogPost1 - Principal Accountability Producer"
          />
        </Head>
        <DataProvider
          renderSuccess={(params) => (
            <>
              <Repeater
                items={params}
                renderItem={(BlogPostEntities) => (
                  <>
                    <div className="blog-post11-container1">
                      <h1>{BlogPostEntities?.title}</h1>
                      <span>{BlogPostEntities?.title}</span>
                      <span>{BlogPostEntities?.readingCount}</span>
                    </div>
                  </>
                )}
              />
            </>
          )}
          initialData={props.blogPostEntities}
          persistDataDuringLoading={true}
          key={props?.pagination?.page}
        />
      </div>
      <style jsx>
        {`
          .blog-post11-container {
            width: 100%;
            display: flex;
            overflow: auto;
            min-height: 100vh;
            align-items: center;
            flex-direction: column;
          }
          .blog-post11-container1 {
            gap: 12px;
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
          }
        `}
      </style>
    </>
  )
}

BlogPost11.defaultProps = {
  blogPostEntities: [],
}

BlogPost11.propTypes = {
  blogPostEntities: PropTypes.array,
}

export default BlogPost11

export async function getStaticPaths() {
  try {
    const response = await getEntities({
      projectId: '3bd8eb33-2aaa-4620-87bf-d7ccd04d0245',
      query: '{allBlogPost{edges{node{id}}}}',
    })
    const totalCount = response?.meta?.pagination?.total
    const pagesCount = Math.ceil(totalCount / 10)
    return {
      paths: Array.from(
        {
          length: pagesCount,
        },
        (_, i) => ({
          params: {
            page: (i + 1).toString(),
          },
        })
      ),
      fallback: 'blocking',
    }
  } catch (error) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

export async function getStaticProps(context) {
  try {
    const response = await getEntitiesWithPagination({
      ...context?.params,
      projectId: '3bd8eb33-2aaa-4620-87bf-d7ccd04d0245',
      query:
        'query MyQuery($first: Int, $after: String){allBlogPost(first: $first, after: $after){pageInfo{endCursor,hasNextPage,hasPreviousPage}edges{node{_meta{createdAt updatedAt id}slug cover{__typename _meta{createdAt updatedAt id}description height id src title width}title assets{__typename ...on Asset{ _meta{createdAt updatedAt id}description height id src title width}}author{__typename...on Author{_meta{createdAt updatedAt id}name image{__typename _meta{createdAt updatedAt id}description height id src title width}}}authors{__typename...on Author{_meta{createdAt updatedAt id}name image{__typename _meta{createdAt updatedAt id}description height id src title width}}}content{json connections{__typename ...on Asset{description height id src title width} }}testTab location{formattedAddress latitude longitude zoom}isVisible pulbished themeColor readingCount}}}}',
      page: context.params.page,
      perPage: 10,
    })
    if (!response) {
      return {
        notFound: true,
      }
    }
    return {
      props: {
        blogPostEntities: response,
        ...response?.meta,
      },
      revalidate: 60,
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}
