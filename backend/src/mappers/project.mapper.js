exports.mapProjectData = (body) => ({
    name: body.name,
    project_type: body.project_type,
    description: body.description,
    start_date: body.start_date,
    end_date: body.end_date,
    price: body.price,
    labels: body.labels
})