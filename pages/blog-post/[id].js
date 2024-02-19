import React from 'react'
import Head from 'next/head'

import {
  DataProvider,
  Repeater,
  CaisyDocumentLink,
} from '@teleporthq/react-components'
import { RichTextRenderer } from '@caisy/rich-text-react-renderer'
import PropTypes from 'prop-types'
import {
  getEntities,
  getEntityByAttribute,
} from '@teleporthq/cms-mappers/caisy'

const BlogPost = (props) => {
  return (
    <>
      <div className="blog-post-container">
        <Head>
          <title>BlogPost - Principal Accountability Producer</title>
          <meta
            property="og:title"
            content="BlogPost - Principal Accountability Producer"
          />
        </Head>
        <DataProvider
          renderSuccess={(BlogPostEntity) => (
            <>
              <div className="blog-post-container1">
                <h1>{BlogPostEntity?.title}</h1>
                <span>{BlogPostEntity?.readingCount}</span>
                <span>{BlogPostEntity?.slug}</span>
                <div className="blog-post-container2">
                  <RichTextRenderer
                    node={BlogPostEntity?.content}
                    overwrites={{
                      documentLink: CaisyDocumentLink,
                    }}
                  ></RichTextRenderer>
                </div>
              </div>
            </>
          )}
          initialData={props.blogPostEntity}
          persistDataDuringLoading={true}
          key={props?.blogPostEntity?.id}
        />
      </div>
      <style jsx>
        {`
          .blog-post-container {
            width: 100%;
            display: flex;
            overflow: auto;
            min-height: 100vh;
            align-items: center;
            flex-direction: column;
          }
          .blog-post-container1 {
            gap: 12px;
            width: 100%;
            display: flex;
            flex-direction: column;
          }
          .blog-post-container2 {
            width: 100%;
            align-self: stretch;
          }
        `}
      </style>
    </>
  )
}

BlogPost.defaultProps = {
  blogPostEntity: [],
}

BlogPost.propTypes = {
  blogPostEntity: PropTypes.array,
}

export default BlogPost

export async function getStaticPaths() {
  try {
    const response = await getEntities({
      projectId: '3bd8eb33-2aaa-4620-87bf-d7ccd04d0245',
      query: '{allBlogPost{edges{node{id}}}}',
    })
    return {
      paths: (response?.data || []).map((item) => {
        return {
          params: {
            id: (item?.id).toString(),
          },
        }
      }),
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
    const response = await getEntityByAttribute({
      ...context?.params,
      projectId: '3bd8eb33-2aaa-4620-87bf-d7ccd04d0245',
      query:
        'query BlogPost($value:ID!){BlogPost(id:$value){_meta{createdAt updatedAt id}slug cover{__typename _meta{createdAt updatedAt id}description height id src title width}title assets{__typename ...on Asset{ _meta{createdAt updatedAt id}description height id src title width}}author{__typename...on Author{_meta{createdAt updatedAt id}name image{__typename _meta{createdAt updatedAt id}description height id src title width}}}authors{__typename...on Author{_meta{createdAt updatedAt id}name image{__typename _meta{createdAt updatedAt id}description height id src title width}}}content{json connections{__typename ...on Asset{description height id src title width} }}testTab location{formattedAddress latitude longitude zoom}isVisible pulbished themeColor readingCount}}',
      attribute: 'id',
    })
    if (!response?.data?.[0]) {
      return {
        notFound: true,
      }
    }
    return {
      props: {
        blogPostEntity: response?.data?.[0],
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
