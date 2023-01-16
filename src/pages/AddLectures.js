import { useState, useEffect } from 'react'
import { Container, Card, CardContent, Typography, Box, FormControl, FormHelperText, Select, MenuItem, TextField, Button, Dialog, DialogContent, DialogTitle, DialogActions, Grid, IconButton, Tooltip } from '@mui/material'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/de'
import { ELECTURE_THB_DOMAIN, PREFIXES, FIELD_INFOS, Person } from './../utils/constants'
import Header from './../components/Header'
import shapes_file from './../utils/shacl-shapes.ttl'
import factory from 'rdf-ext'
import N3 from 'n3'
import SHACLValidator from 'rdf-validate-shacl'

const AddLecture = () => {
	const [lecture, setLecture] = useState({ license: 'https://creativecommons.org/licenses/by-nc-sa/2.0/de/' })
	const [clip, setClip] = useState({})
	const [clips, setClips] = useState([])
	const [departments, setDepartments] = useState([])
	const [studyPrograms, setStudyPrograms] = useState([])
	const [modules, setModules] = useState([])
	const [dialogOpen, setDialogOpen] = useState(false)
	const [creators, setCreators] = useState([])
	const [validationReports, setValidationReports] = useState({})

	const createTurtleData = () => {
		let data = PREFIXES

		data += `
		vide:${lecture?.name} a vidp:VideoLecture ;
			${lecture?.label ? `rdfs:label "${lecture?.label}" ;` : ''}
			${lecture?.name ? `schema:name "${lecture?.name}" ;` : ''}
			schema:headline "${lecture?.headline_de}"@de , "${lecture?.headline_en}"@en ;
			${lecture?.language ? `schema:inLanguage "${lecture?.language}" ;` : ''}
			${lecture?.thumbnail ? `schema:thumbnail ${lecture?.thumbnail} ;` : ''}
			schema:keywords "${lecture?.keywords_de}"@de , "${lecture?.keywords_en}"@en ;
			schema:description "${lecture?.description_de}"@de , "${lecture?.description_en}"@en ;
			${lecture?.license ? `schema:license "${lecture?.license}" ;` : ''}
			${lecture?.module ? `schema:about module:${lecture?.module}` : ''} .
		`
		
		clips.map(clip => {
			return lecture?.name && clip?.id ? `
				vide:${lecture?.name}_${clip?.id} a schema:VideoObject ;
					rdfs:label "${lecture?.name} Clip ${clip?.id}" ;
					schema:isPartOf vide:${lecture?.name} ;
					schema:name "${lecture?.name} Clip ${clip?.id}" ;
					${clip?.headline ? `schema:headline "${clip?.headline}" ;` : ''}
					${clip?.creator ? `schema:creator ${clip?.creator} ;` : ''}
					${clip?.dateCreated ? `schema:dateCreated "${clip?.dateCreated}"^^xsd:date ;` : ''}
					${clip?.hours || clip?.minutes || clip?.seconds ? `schema:duration "PT${clip?.hours && clip?.hours !== "0" ? `${clip?.hours}H` : ''}${clip?.minutes && clip?.minutes !== "0" ? `${clip?.minutes}M` : ''}${clip?.seconds && clip?.seconds !== "0" ? `${clip?.seconds}S` : ''}" ; ` : ''}
					schema:encodingFormat "mp4" ;
					${clip?.playerType ? `schema:playerType "${clip?.playerType}" ;` : ''}
					schema:maintainer wd:Q156376 ;
					${clip?.playerType ? `schema:additionalProperty ${clip?.playerType === 'double' ? `vide:${lecture?.name}_${clip?.id}_idl, vide:${lecture?.name}_${clip?.id}_ids` : `vide:${lecture?.name}_${clip?.id}_idp`}` : ''} .

				${clip?.playerType === 'double' 
					? `
					vide:${lecture?.name}_${clip?.id}_idl a schema:PropertyValue ; 
						schema:name "lecturer" ; 
						schema:propertyID "${clip?.lecturer}" .
					vide:${lecture?.name}_${clip?.id}_ids a schema:PropertyValue ; 
						schema:name "screencast" ; 
						schema:propertyID "${clip?.screencast}" .
					` 
					: `
						vide:${lecture?.name}_${clip?.id}_idp a schema:PropertyValue ;
							schema:name "podcast" ; 
							schema:propertyID "${clip?.podcast}" .
					`
				}
				
			` : ''
		}).forEach(clip => data += clip)

		return data
	}

	const createQuads = (data) => {
		console.log(data)
		return new Promise(async resolve => {
			let quads = []
			const parser = new N3.Parser()
			parser.parse(data, (error, quad, prefixes) => {
				if (quad) quads.push(quad)
				else resolve(quads)
			})
		})
	}

	async function validateData(value) {
		const stream = await axios.get(shapes_file)
		const shapes = await createQuads(stream.data)
		const data = await createQuads(value)
		console.log(shapes)
		console.log(data)

		const validator = new SHACLValidator(factory.dataset(shapes))
		const report = await validator.validate(factory.dataset(data))

		console.log(report)
		let reports = []
		report.results.forEach(result => {
			const nodes = reports.find(report => report.node === result?.focusNode?.id)
			if(nodes) {
				nodes.property.push({
					path: result?.path?.id,
					message: result?.message[0]?.value,
					severity: result?.severity?.value,
					sourceConstraintComponent: result?.sourceConstraintComponent?.value,
					sourceShape: result?.sourceShape?.id
				})
			} else {
				reports.push({
					node: result?.focusNode?.id,
					property: [{
						path: result?.path?.id,
						message: result?.message[0]?.value,
						severity: result?.severity?.value,
						sourceConstraintComponent: result?.sourceConstraintComponent?.value,
						sourceShape: result?.sourceShape?.id
					}]
				})
			}
		})
		setValidationReports({ conformance: report.conforms, reports: reports })
		return report.conforms
	}

	const downloadTurtleData = (data) => {
		const url = URL.createObjectURL(new Blob([data]))
		const link = document.createElement('a')
		link.href = url;
		link.download = `${lecture?.name ?? 'newLecture'}.ttl`
		document.body.appendChild(link)
		link.click()
		link.parentNode.removeChild(link)
		URL.revokeObjectURL(url)
	}

	const handleSubmit = async (event) => {
		event.preventDefault()

		const data = createTurtleData()
		const validation = await validateData(data)
		// if(validation) downloadTurtleData(data)
	}

	const handleChangeClip = (event, name) => {
		setClip({...clip, [name]: event.target.value})
	}

	const handleDoubleChangeInput = (event, name1, name2) => {
		setLecture({...lecture, [name1]: event.target.value, [name2]: event.target.value})
	}

	const handleChangeInput = (event, name) => {
		setLecture({...lecture, [name]: event.target.value})
	}

	const handleRemoveClip = () => {
		setClips(clips.slice(0, -1))
	}

	const handleOpenDialog = (event) => {
		if (event.currentTarget.dataset.command === 'add') setDefaultDialogFields()
		else if (event.currentTarget.dataset.command === 'update') setValueDialogFields(event.currentTarget.dataset.index ?? -1)
		setDialogOpen(true)
	}

	const handleCloseDialog = () => {
		setDialogOpen(false)
	}

	const handleDialogCommand = () => {
		if(clip?.id < clips.length) {
			setClips(clips.map(row =>
				row.id === clip?.id
					? clip
					: row
			))
		}else {
			setClips([...clips, clip])
		}
		setDialogOpen(false)
	}

	const setDefaultDialogFields = () => {
		setClip({ id: String(clips.length).padStart(2, '0'), dateCreated: moment().format('YYYY-MM-DD') })
	}

	const setValueDialogFields = (index) => {
		if (index === -1) setDefaultDialogFields()
		const clip = clips[index]
		setClip({ 
			id: clip?.id,
			dateCreated: clip?.dateCreated,
			headline: clip?.headline,
			creator: clip?.creator,
			hours: clip?.hours,
			minutes: clip?.minutes,
			seconds: clip?.seconds,
			playerType: clip?.playerType,
			lecturer: clip?.lecturer,
			screencast: clip?.screencast,
			podcast: clip?.podcast
		})
	}

	console.log(departments)
	console.log(studyPrograms)
	console.log(lecture)
	console.log(clips)
	console.log(clip)
	console.log(creators)
	console.log(validationReports)
	
	useEffect(() => {
		const headers = { 'Accept-Language': 'de' }
		axios.get(`${ELECTURE_THB_DOMAIN}/api/v1/collegeOrUniversity/`, { headers: headers }).then(response => setDepartments(response.data?.result))
	
		setCreators(Person)
	}, [])

	useEffect(() => {
		const headers = { 'Accept-Language': 'de' }
		if(lecture.department) axios.get(`${ELECTURE_THB_DOMAIN}/api/v1/studyProgram/collegeOrUniversity/${lecture?.department}`, { headers: headers }).then(response => setStudyPrograms(response.data?.result))
		setLecture({...lecture, studyProgram: '', module: ''})
		setModules([])
	}, [lecture.department])

	useEffect(() => {
		const headers = { 'Accept-Language': 'de' }
		if(lecture.studyProgram) axios.get(`${ELECTURE_THB_DOMAIN}/api/v1/module/studyProgram/${lecture?.studyProgram}`, { headers: headers }).then(response => setModules(response.data?.result))
		setLecture({...lecture, module: ''})
	}, [lecture.studyProgram])

	return (
		<>
			<Header />
			<Container maxWidth='lg'>
				<Card raised sx={{ marginTop: 1, marginBottom: 1}}>
					<CardContent>
						<form onSubmit={(e) => handleSubmit(e)}>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
									Fachbereich
								</Typography>
								<FormControl fullWidth required size='small'>
									<Select
										displayEmpty
										value={lecture?.department ?? ''}
										onChange={(e) => handleChangeInput(e, 'department')}
									>
										<MenuItem value=''>Bitte auswählen</MenuItem>
										{departments.map((department, index) => (
											<MenuItem value={department.iri} key={index}>{`${department.name?.split(' - ')[1]}`}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
									Studiengang
								</Typography>
								<FormControl fullWidth required size='small'>
									<Select
										displayEmpty
										value={lecture?.studyProgram ?? ''}
										onChange={(e) => handleChangeInput(e, 'studyProgram')}
									>
										<MenuItem value=''>Bitte auswählen</MenuItem>
										{studyPrograms.map((studyProgram, index) => (
											<MenuItem value={studyProgram.iri} key={index}>{`${studyProgram.name}`}</MenuItem>
										))}
										{/* {state.studyProgram.map((programs, index) => (
											<MenuItem value={programs.id} key={index}>{`${programs.id?.replace('module:', '')} - ${programs.label}`}</MenuItem>
										))} */}
									</Select>
								</FormControl>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
									Module
								</Typography>
								<FormControl
									fullWidth
									required
									size='small'
									error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('about'))}
								>
									<Select
										displayEmpty
										value={lecture?.module ?? ''}
										onChange={(e) => handleChangeInput(e, 'module')}
									>
										<MenuItem value=''>Bitte auswählen</MenuItem>
										{modules.map((module, index) => (
											<MenuItem value={module.iri} key={index}>{`${module.name}`}</MenuItem>
										))}
									</Select>
									<FormHelperText>{validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('about'))?.message ?? ''}</FormHelperText>
								</FormControl>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
									Name der eLecture (de)
								</Typography>
								<TextField
									variant='outlined'
									fullWidth
									value={lecture?.headline_de ?? ''}
									onChange={(e) => handleChangeInput(e, 'headline_de')}
									required
									size='small'
									error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('headline'))}
									helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('headline'))?.message ?? ''}
								/>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
									Name der eLecture (en)
								</Typography>
								<TextField
									variant='outlined'
									fullWidth
									value={lecture?.headline_en ?? ''}
									onChange={(e) => handleChangeInput(e, 'headline_en')}
									required
									size='small'
									error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('headline'))}
									helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('headline'))?.message ?? ''}
								/>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
									Kürzel
								</Typography>
								<TextField
									variant='outlined'
									fullWidth
									value={lecture?.label ?? ''}
									onChange={(e) => handleDoubleChangeInput(e, 'label', 'name')}
									required
									size='small'
									error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('name'))}
									helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('name'))?.message ?? FIELD_INFOS.addLectures.abbreviation}
								/>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
									Sprache
								</Typography>
								<FormControl
									fullWidth
									required
									size='small'
									error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('inLanguage'))}
								>
									<Select
										displayEmpty
										value={lecture?.language ?? ''}
										onChange={(e) => handleChangeInput(e, 'language')}
									>
										<MenuItem value=''>Bitte auswählen</MenuItem>
										<MenuItem value='de'>DE</MenuItem>
										<MenuItem value='en'>EN</MenuItem>
									</Select>
									<FormHelperText>{validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('inLanguage'))?.message ?? FIELD_INFOS.addLectures.language}</FormHelperText>
								</FormControl>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
									Icon
								</Typography>
								<TextField
									variant='outlined'
									fullWidth
									value={lecture?.thumbnail ?? ''}
									onChange={(e) => handleChangeInput(e, 'thumbnail')}
									required
									size='small'
									error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('thumbnail'))}
									helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('thumbnail'))?.message ?? FIELD_INFOS.addLectures.abbreviation}
									
								/>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
									Keywords (de)
								</Typography>
								<TextField
									variant='outlined'
									fullWidth
									value={lecture?.keywords_de ?? ''}
									onChange={(e) => handleChangeInput(e, 'keywords_de')}
									required
									size='small'
									error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('keyword'))}
									helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('keyword'))?.message ?? ''}
								/>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
									Keywords (en)
								</Typography>
								<TextField
									variant='outlined'
									fullWidth
									value={lecture?.keywords_en ?? ''}
									onChange={(e) => handleChangeInput(e, 'keywords_en')}
									required
									size='small'
									error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('keyword'))}
									helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('keyword'))?.message ?? ''}
								/>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
									Beschreibung (de)
								</Typography>
								<TextField
									variant='outlined'
									fullWidth
									value={lecture?.description_de ?? ''}
									onChange={(e) => handleChangeInput(e, 'description_de')}
									required
									size='small'
									multiline
									rows={4}
									error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('description'))}
									helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('description'))?.message ?? ''}
								/>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
									Beschreibung (en)
								</Typography>
								<TextField
									variant='outlined'
									fullWidth
									value={lecture?.description_en ?? ''}
									onChange={(e) => handleChangeInput(e, 'description_en')}
									required
									size='small'
									multiline
									rows={4}
									error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('description'))}
									helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('description'))?.message ?? ''}
								/>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
									Provider
								</Typography>
								<TextField
									variant='outlined'
									fullWidth
									value={lecture?.provider ?? ''}
									onChange={(e) => handleChangeInput(e, 'provider')}
									required
									size='small'
									error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('provider'))}
									helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('provider'))?.message ?? FIELD_INFOS.addLectures.provider}
								/>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
									Lizenz
								</Typography>
								<TextField
									variant='outlined'
									fullWidth
									value={lecture?.license ?? ''}
									disabled
									required
									size='small'
									error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('license'))}
									helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}`))?.property.find(property => property?.path.includes('license'))?.message ?? ''}
								/>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Grid container spacing={1}>
									{clips.map((clip, index) => (
										<Grid item sm={6} md={4} lg={3} key={index} sx={{ width: '100%' }}>
											<Card variant='outlined' sx={{ backgroundColor: '#F8F7FF', height: '100%', borderColor: validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`)) ? 'red' : 'rgba(0, 0, 0, 0.12)' }}>
												<CardContent sx={{ display: 'flex', gap: 2 }}>
													<Box sx={{ flexGrow: 1 }}>
														<Typography variant='caption'>
															{`${lecture?.name} Clip ${clip?.id} (${clip?.dateCreated})`}
														</Typography>
														<Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
															{clip?.headline}
														</Typography>
														<Typography variant='subtitle2'>
															{clip?.creator}
														</Typography>
														<Typography variant='subtitle2'>
															{clip?.hours?.padStart(2, '0') ?? '00'}:{clip?.minutes?.padStart(2, '0') ?? '00'}:{clip?.seconds?.padStart(2, '0') ?? '00'}
														</Typography>
														<Typography variant='subtitle2'>
															{`${clip?.playerType} (${clip?.playerType === 'double' ? `${clip?.lecturer}, ${clip?.screencast}` : `${clip?.podcast}`})`}
														</Typography>
													</Box>
													<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
														<IconButton
															component='span'
															size='small'
															color='info'
															onClick={handleOpenDialog}
															data-command='update'
															data-index={index}
														>
															<MdEdit />
														</IconButton>
														{index === clips.length - 1 &&
															<IconButton
																component='span'
																size='small'
																onClick={handleRemoveClip}
																color='error'
															>
																<FaTimes />
															</IconButton>
														}
													</Box>
												</CardContent>
											</Card>
										</Grid>
									))}
									<Grid item sm={6} md={4} lg={3} sx={{ width: '100%' }}>
										<Button
											variant='contained'
											fullWidth
											color='error'
											startIcon={<FaPlus />}
											onClick={handleOpenDialog}
											data-command='add'
											sx={{height: '100%'}}
										>
											Videoclips anlegen
										</Button>
									</Grid>
								</Grid>
							</Box>
							<Box sx={{ marginBottom: 2 }}>
								<Button
									variant='contained'
									color='error'
									size='large'
									fullWidth
									onClick={handleSubmit}
									// sx={{ fontWeight: 600, textTransform: 'capitalize', color: '#FFFFFF', backgroundColor: '#000000', '&:hover': {color: '#FFFFFF', backgroundColor: '#212121'} }}
								>
									Create TTL
								</Button>
							</Box>
						</form>
						
						<Box sx={{ marginBottom: 2 }}>
							<Grid container spacing={1}>
								{validationReports?.reports?.map((report, index) => (
									<Grid item sm={6} md={6} lg={6} key={index}>
										<Card variant='outlined' sx={{ backgroundColor: '#F8F7FF'}}>
											<CardContent sx={{ display: 'flex', gap: 2 }}>
												<Box>
													<Typography variant='subtitle1'>
														{report?.node}
													</Typography>
													{report.property.map(property => (
														<>
															<Typography variant='subtitle1'>
																{property?.path}
															</Typography>
															<Typography variant='subtitle1'>
																{property?.message}
															</Typography>
														</>
													))}
												</Box>
											</CardContent>
										</Card>
									</Grid>
								))}
							</Grid>
						</Box>
					</CardContent>
				</Card>
				<Dialog
					open={dialogOpen}
					onClose={handleCloseDialog}
					scroll='paper'
					fullWidth
					maxWidth='lg'
				>
					<DialogTitle>Videoclips {clip?.id < clips.length ? 'aktualisieren' : 'anlegen'}</DialogTitle>
					<DialogContent dividers>
						<Card variant='outlined' sx={{ marginTop: 1, marginBottom: 1, backgroundColor: '#F8F7FF'}}>
							<CardContent>
								<Box sx={{ marginBottom: 2, display: 'flex', gap: 2 }}>
									<Box sx={{ flexGrow: 1 }}>
										<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
											Clip Nummer
										</Typography>
										<TextField
											variant='outlined'
											fullWidth
											value={clip?.id ?? '00'}
											disabled
											required
											size='small'
										/>
									</Box>
									<Box sx={{ flexGrow: 1 }}>
										<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
											Erstellungstag
										</Typography>
										<TextField
											variant='outlined'
											fullWidth
											value={clip?.dateCreated ?? moment().format('YYYY-MM-DD')}
											onChange={(e) => handleChangeClip(e, 'dateCreated')}
											required
											size='small'
											error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('dateCreated'))}
											helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('dateCreated'))?.message ?? ''}
										/>
									</Box>
								</Box>
								<Box sx={{ marginBottom: 2 }}>
									<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
										Title Clip
									</Typography>
									<TextField
										variant='outlined'
										fullWidth
										value={clip?.headline ?? ''}
										onChange={(e) => handleChangeClip(e, 'headline')}
										required
										size='small'
										error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('headline'))}
										helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('headline'))?.message ?? ''}
									/>
								</Box>
								<Box sx={{ marginBottom: 2 }}>
									<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
										Vortragende
									</Typography>
									<FormControl
										fullWidth
										required
										size='small'
										error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('creator'))}
									>
										<Select
											displayEmpty
											value={clip?.creator ?? ''}
											onChange={(e) => handleChangeClip(e, 'creator')}
										>
											<MenuItem value=''>Bitte auswählen</MenuItem>
											{creators.map((creator, index) => (
												<MenuItem value={creator.id} key={index}>{`${creator.label}`}</MenuItem>
											))}
										</Select>
										<FormHelperText>{validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('creator'))?.message ?? ''}</FormHelperText>
									</FormControl>
								</Box>
								<Box sx={{ marginBottom: 2 }}>
									<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
										Laufzeit
									</Typography>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<TextField
											variant='outlined'
											fullWidth
											value={clip?.hours ?? ''}
											onChange={(e) => handleChangeClip(e, 'hours')}
											size='small'
											label='Stunden'
											error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('duration'))}
											helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('duration'))?.message ?? ''}
										/>
										<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
											:
										</Typography>
										<TextField
											variant='outlined'
											fullWidth
											value={clip?.minutes ?? ''}
											onChange={(e) => handleChangeClip(e, 'minutes')}
											size='small'
											label='Minuten'
											error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('duration'))}
											helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('duration'))?.message ?? ''}
										/>
										<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
											:
										</Typography>
										<TextField
											variant='outlined'
											fullWidth
											value={clip?.seconds ?? ''}
											onChange={(e) => handleChangeClip(e, 'seconds')}
											size='small'
											label='Sekunden'
											error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('duration'))}
											helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('duration'))?.message ?? ''}
										/>
									</Box>
								</Box>
								<Box sx={{ marginBottom: 2 }}>
									<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
										Type
									</Typography>
									<FormControl
										fullWidth
										required
										size='small'
										error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('playerType'))}
									>
										<Select
											displayEmpty
											value={clip?.playerType ?? ''}
											onChange={(e) => handleChangeClip(e, 'playerType')}
										>
											<MenuItem value=''>Bitte auswählen</MenuItem>
											<MenuItem value='single'>Single</MenuItem>
											<MenuItem value='double'>Double</MenuItem>
										</Select>
										<FormHelperText>{validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('playerType'))?.message ?? FIELD_INFOS.addLectures.playerType}</FormHelperText>
									</FormControl>
								</Box>
								{clip?.playerType === 'single' && 
									<Box sx={{ marginBottom: 2, display: 'flex', gap: 2 }}>
										<Box sx={{ flexGrow: 1 }}>
											<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
												Providercode Podcast
											</Typography>
											<TextField
												variant='outlined'
												fullWidth
												value={clip?.podcast ?? ''}
												onChange={(e) => handleChangeClip(e, 'podcast')}
												required
												size='small'
												error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('additionalProperty'))}
												helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('additionalProperty'))?.message ?? FIELD_INFOS.addLectures.vimeoID}
											/>
										</Box>
									</Box>
								}
								{clip?.playerType === 'double' && 
									<Box sx={{ marginBottom: 2, display: 'flex', gap: 2 }}>
										<Box sx={{ flexGrow: 1 }}>
											<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
												Providercode Lecturer
											</Typography>
											<TextField
												variant='outlined'
												fullWidth
												value={clip?.lecturer ?? ''}
												onChange={(e) => handleChangeClip(e, 'lecturer')}
												required
												size='small'
												error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('additionalProperty'))}
												helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('additionalProperty'))?.message ?? FIELD_INFOS.addLectures.vimeoID}
											/>
										</Box>
										<Box sx={{ flexGrow: 1 }}>
											<Typography variant='subtitle1' sx={{ marginBottom: 0.5 }}>
												Providercode Desktop
											</Typography>
											<TextField
												variant='outlined'
												fullWidth
												value={clip?.screencast ?? ''}
												onChange={(e) => handleChangeClip(e, 'screencast')}
												required
												size='small'
												error={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('additionalProperty'))}
												helperText={validationReports?.reports?.find(report => report.node.includes(`${lecture?.name}_${clip?.id}`))?.property.find(property => property?.path.includes('additionalProperty'))?.message ?? FIELD_INFOS.addLectures.vimeoID}
											/>
										</Box>
									</Box>
								}
							</CardContent>
						</Card>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseDialog} color='secondary'>
							Abrechen
						</Button>
						<Button onClick={handleDialogCommand} color='primary'>
							{clip?.id < clips.length ? 'aktualisieren' : 'anlegen'}
						</Button>
					</DialogActions>
				</Dialog>
			</Container>
		</>
	)
}

export default AddLecture