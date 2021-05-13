import React, { useState } from "react"
import Layout from "./layout"
import SEO from "./seo"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button, List, useMediaQuery } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from "react-redux";
import { State } from "../Global/Types/SliceTypes";
import CircularProgress from '@material-ui/core/CircularProgress';
import Bookmark from "./Bookmark";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      width: '30ch',
    },
    button: {
      marginLeft: '15px',
    },
    root: {
      width: '100%',
      minWidth: 380,
      backgroundColor: theme.palette.background.paper,
    },
    rootQuery: {
      width: '100%',
      minWidth: 305,
      backgroundColor: theme.palette.background.paper,
    },
    list: {
      marginTop: '10px',
      marginLeft: '10px',
    },
    LightList: {
      backgroundColor: 'hsl(227deg 100% 97%)',
    },
  }),
);


// This query is executed at run time by Apollo.
export const GET_BOOKMARK = gql`
{
  bookmarks {
    name,
    id,
    url,
  }
}
`;

const ADD_BOOKMARK = gql`
  mutation addBookmark($name: String!, $url: String) {
    addBookmark(name: $name, url: $url) {
      name,
      url
    }
  }
`;

interface Info {
  id: string
  name: string
  url: string
}

const TaskBox= () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_BOOKMARK);
  const islit = useSelector((state: State) => state.themes.value);
  const matches = useMediaQuery('(max-width:380px)');
  const [value, setValue] = useState("");
  const [AddBookmark, { loading: AddLoading }] = useMutation(ADD_BOOKMARK);
  const [DelLoading, setDelLoading] = useState(false);
  const [EditLoading, setEditLoading] = useState(false);
  const [Error, setError] = useState(false);

  const AddTask = (event: React.FormEvent) => {
    event.preventDefault();
    if (value === "") {
      setError(true);
    } else {
      AddBookmark({
        variables: {
          task: value
        },
        // refetchQueries: [{ query: GET_TODO }]
      })
      setValue('');
    }
  }

  if (loading) {
    return (
      <Layout>
        <SEO title="Todo" />
        <h1>Loading...</h1>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <SEO title="Todo" />
        <h3>Error, Please try again later</h3>
      </Layout>
    );
  }

  const Load = () => {
    return (
      <div className="loading">
        <CircularProgress />
      </div>
    )
  }

  if (data) {
    return (
      <Layout>
        <SEO title="Todo" />
        {AddLoading || DelLoading || EditLoading ?
          <Load />
          :
          null}
        <form onSubmit={AddTask}>
          <div className="main">
            <TextField className={classes.input} error={Error} helperText={Error ? 'Empty field!' : ' '} onChange={(e) => setValue(e.target.value)} value={value} id="outlined-basic" label="Add Task" variant="outlined" />
            <Button type="submit" className={`button ${classes.button}`} variant="contained" color="primary">ADD TASK</Button>
          </div>
        </form>
        { data.todos && data.todos.map((info: Info, index: number) =>
          <List key={index} className={`${matches ? classes.rootQuery : classes.root} ${classes.list} ${islit ? classes.LightList : ''} `}>
            <Bookmark setDelLoading={setDelLoading} setEditLoading={setEditLoading} name={info.name} id={info.id} url={info.url} />
          </List>
        )
        }
      </Layout >
    );
  }
  else {
    return (
      <h1>Please Reload!</h1>
    )
  }
}

export default TaskBox;