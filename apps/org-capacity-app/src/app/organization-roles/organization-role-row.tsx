import React, { useState, useEffect } from 'react';
import { Edit, RemoveCircle, Done, Close, DeleteForever } from '@material-ui/icons';
import { 
  makeStyles, 
  TableRow, 
  TableCell, 
  IconButton, 
  Select, 
  MenuItem, 
  Input, 
  InputAdornment, 
  TextField, 
  Grid 
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Role, Person, AvailabilityStatusType, AvailabilityStatus, PersonCriteria } from '../../types';

interface OrganizationRoleRowProps {
  canEdit: boolean
  showDelete: boolean
  statusTypes: {
    [id: string]: AvailabilityStatusType
  }
  organizationId: string
  people: Person[]
  role: Role
  onModifyPersonCriteria: (criteria: PersonCriteria) => void
  onDeleteRole: (organizationId: string, roleId: string) => void
  onModifyRole: (organizationId: string, role: Role) => void
  onUpdateAvailability: (
    organizationId: string, personId: string, status: AvailabilityStatus
  ) => void
}

const useStyles = makeStyles(theme => ({
  row: {
    '&[data-deleting=true]': {
      background: '#f1f1f1'
    }
  },
  actionsCell: {
    verticalAlign: 'top'
  },
  assignment: {
    display: 'flex',
    background: '#f1f1f1',
    padding: theme.spacing(1),
    minHeight: theme.spacing(10),
    '& > div': {
      display: 'flex',
      padding: theme.spacing(1),
      border: '1px solid #dcdcdc',
      boxSizing: 'border-box',
      background: '#fff',
      flexGrow: 1,
      '& :last-child': {
        margin: 'auto',
        marginRight: 'inherit'
      }
    },
    '& > span': {
      flexGrow: 1,
      margin: 'auto',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    }
  },
  status: {
    '& > *': {
      visibility: (
        {showDelete}: OrganizationRoleRowProps
      ) => showDelete ? 'hidden' : 'visible'
    }
  }
}))

export const OrganizationRoleRow = ({
  canEdit,
  showDelete,
  statusTypes, 
  organizationId,
  people,
  role,
  onModifyPersonCriteria,
  onDeleteRole,
  onModifyRole,
  onUpdateAvailability
}: OrganizationRoleRowProps) => {
  
  const classes = useStyles({showDelete});
  const [edit, setEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modified, setModified] = useState(null);
  const [personCriteria, setPersonCriteria] = useState({} as PersonCriteria);

  useEffect(
    () => {
      if (role) {
        setModified({...role})
      }
    },
    [role]
  )

  useEffect(
    () => {
      setDeleting(false);
    },
    [showDelete]
  )

  return (
    <TableRow className={classes.row} data-deleting={deleting}>
      {
        canEdit &&
        <TableCell className={classes.actionsCell}>
          {
            !edit ?
            (
              !showDelete ?
              <IconButton
                onClick={() => setEdit(true)}>
                <Edit />
              </IconButton> :
              <IconButton color={deleting ? 'secondary' : 'default'}
                onClick={() => 
                  deleting ? 
                    onDeleteRole(organizationId, role.id) : 
                    setDeleting(true)
                }
              >
                <DeleteForever />
              </IconButton>
            ) :
            <div>
              <IconButton color="primary"
                onClick={() => {
                  setEdit(false);
                  onModifyRole(organizationId, modified);
                }}>
                <Done />
              </IconButton>
              <IconButton color="secondary"
                onClick={() => {
                  setEdit(false);
                  setModified({...role});
                }}>
                <Close />
              </IconButton>
            </div>
          }
        </TableCell>
      }
      {
        edit ? 
        <TableCell colSpan={4}>
          <Grid container spacing={2}>
            <Grid item sm={6} md={3}>
              <TextField fullWidth
                value={modified.name} 
                onChange={(e) => setModified({...modified, name: e.target.value})} />
            </Grid>
            <Grid item sm={12} md={9}>
              <div className={classes.assignment}>
                {
                  modified.assigned ?
                  <div>
                    <span>
                      { modified.assigned &&
                        `${modified.assigned.firstName} ${modified.assigned.lastName}`
                      }
                    </span>
                    <IconButton color="secondary"
                      onClick={() => setModified({...modified, assigned: null})}>
                      <RemoveCircle />
                    </IconButton>
                  </div> :
                  <span>
                    <Autocomplete
                      freeSolo={true} 
                      options={people}
                      value={modified.assigned}
                      renderInput={(params) => <TextField {...params} label="Assign" variant="outlined" />}
                      getOptionSelected={(option, value) => option.id === value.id}
                      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                      onInputChange={(_, v, r) => {
                        if (r === 'input') {
                          const criteria = {
                            ...personCriteria, 
                            nameContains: v
                          }
                          setPersonCriteria(criteria);
                          onModifyPersonCriteria(criteria);
                        }
                      }}
                      onChange={(_, v, r) => {
                        if (r === 'select-option') {
                          setModified({...modified, assigned: v});
                        }
                      }}
                    />
                    {/* <TextField type="select" inputProps={{list: 'people'}}
                      value={personCriteria.nameContains || ''} 
                      onChange={(e) => {
                        const criteria = {
                          ...personCriteria, 
                          nameContains: e.target.value
                        }
                        setPersonCriteria(criteria);
                        onModifyPersonCriteria(criteria);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          setModified({...modified, assigned: { id: (e.target as any).value }})
                        }
                      }}
                    /> */}
                  </span>
                }
              </div>
            </Grid>
          </Grid>
        </TableCell> :
        <React.Fragment>
          <TableCell component="th" scope="row">
            {role.name}
          </TableCell>
          <TableCell align="left">
            {role.assigned ? `${role.assigned.firstName} ${role.assigned.lastName}`: ''}
          </TableCell>
          <TableCell align="right" className={classes.status}>
            {
              !canEdit &&
              role.assigned &&
              statusTypes[role.assigned.availability.typeId] &&
              statusTypes[role.assigned.availability.typeId].name
            }
            {
              canEdit &&
              role.assigned &&
              <Select 
                value={role.assigned.availability.typeId}
                onChange={(e) => {
                  onUpdateAvailability(
                    organizationId,
                    role.assigned.id, 
                    { 
                      typeId: e.target.value as string,
                      start: new Date(),
                      capacity: statusTypes[e.target.value as string].capacity || 0
                    }
                  )
                }} 
              >
                {
                  Object.entries(statusTypes).map(([id, s]) => 
                    <MenuItem key={id} value={id}>{s.name}</MenuItem>)
                }
              </Select>
            }
          </TableCell>
          <TableCell align="right" className={classes.status}>
            {
              !role.assigned && 
              <span>0 %</span>
            }
            {
              !canEdit &&
              role.assigned &&
              role.assigned.availability.capacity
            }
            {
              canEdit &&
              role.assigned && 
              <Input type="number" inputProps={{max: 100, min: 0}}
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                value={role.assigned.availability.capacity} 
                onChange={(e) => {
                  onUpdateAvailability(
                    organizationId,
                    role.assigned.id, 
                    {...role.assigned.availability, 
                      capacity: parseInt(e.target.value, 10)
                    }
                  )
                }}
              />
            }
          </TableCell>
        </React.Fragment>
      }
    </TableRow>
  )
}

export default OrganizationRoleRow;
