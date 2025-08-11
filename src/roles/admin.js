const { con } = require('../packages/db');


const chartData = {
    labels: ["January", "February", "March", "April", "May"],
    values: [65, 59, 80, 81, 56]
};


const admin_dashboard = async (req, res) => {
    const result = {
        student: await con.query('SELECT COUNT(*) FROM students'),
        institution: await con.query('SELECT COUNT(*) FROM universities'),
        industries: await con.query('SELECT COUNT(*) FROM industries'),
        industry_supervisor: await con.query('SELECT COUNT(*) FROM industry_supervisors'),
        institution_supervisor: await con.query('SELECT COUNT(*) FROM institution_supervisors'),
    };
    const total = {
        student: result.student.rows[0].count,
        institution: result.institution.rows[0].count,
        industries: result.industries.rows[0].count,
        industry_supervisor: result.industry_supervisor.rows[0].count,
        institution_supervisor: result.institution_supervisor.rows[0].count,
    }


    const totals = {
        student: total.student,
        institution: total.institution,
        industries: total.industries,
        industry_supervisor: total.industry_supervisor,
        institution_supervisor: total.institution_supervisor

    }

    const view = req.query.view
    res.render('admin_views/admin_dashboard', {
        layout: false,
        totals,
        view
    })

}

const admin_institutions = async (req, res) => {
    const query = req.query.query || null;

    const fetch_querry = 'SELECT * FROM universities'
    const result = await con.query(fetch_querry,)
    const universities = result.rows;
    res.render('admin_views/admin_institutions', {
        layout: 'layouts/admin_layout',
        query,
        universities,
        chartData
    })
}

const admin_specific_institution_supervisors = async (req, res) => {
    const query = req.query.query || null;

    const school = req.query.school;
    const fetch_query = 'SELECT * FROM institution_supervisors WHERE school_name=$1'
    const result = await con.query(fetch_query, [school]);
    const institution = result.rows;

    res.render('admin_views/admin_specific_institution_supervisors', {
        layout: 'layouts/admin_layout',
        institution,
        school,
        query,
    })
}

const admin_industries = async (req, res) => {
    const query = req.query.query || null;



    const fetch_query = 'SELECT * FROM industries'
    const result = await con.query(fetch_query)
    const industries = result.rows




    res.render('admin_views/admin_industries', {
        layout: 'layouts/admin_layout',
        query,
        industries,
    })
}

const admin_specific_industry_supervisors = async (req, res) => {
    const query = req.query.query || null;

    const industry = req.query.industry
    const trimmed_industry = industry.trim();
    const fetch_query = 'SELECT * FROM industry_supervisors WHERE industry=$1'
    const result = await con.query(fetch_query, [trimmed_industry])
    const supervisors = result.rows


    res.render('admin_views/admin_specific_industry_supervisors', {
        layout: 'layouts/admin_layout',
        supervisors,
        trimmed_industry,
        query,
    })
}


const admin_students = async (req, res) => {
    const query = req.query.query || null;

    const fetch_query = 'SELECT * FROM students'
    const result = await con.query(fetch_query)
    const students = result.rows

    res.render('admin_views/admin_students',
        {
            layout: 'layouts/admin_layout',
            students,
            query,
        }
    )
}

const admin_specific_students = async (req, res) => {
    const student = req.query.student
    const trimmed_student = student.trim()
    const fetch_query = 'SELECT * FROM students WHERE full_name=$1'
    const result = await con.query(fetch_query, [trimmed_student])
    const student_details = result.rows
    res.render('admin_views/admin_specific_student',
        {
            layout: 'layouts/admin_layout',
            student_details
        }
    )
}

const admin_industries_supervisors = async (req, res) => {
    const query = req.query.query || null;



    const fetch_query = 'SELECT * FROM industry_supervisors'
    const result = await con.query(fetch_query);
    const supervisors = result.rows;
    res.render('admin_views/admin_industries_supervisors',
        {
            layout: 'layouts/admin_layout',
            supervisors,
            query,
        }
    )
}

const admin_institutions_supervisors = async (req, res) => {
    const query = req.query.query || null;



    const fetch_query = 'SELECT * FROM institution_supervisors'
    const result = await con.query(fetch_query);
    const supervisors = result.rows;


    res.render('admin_views/admin_institutions_supervisors', {
        layout: 'layouts/admin_layout',
        supervisors,
        query,
    })
}

const admin_settings = (req, res) => {
    res.render('admin_views/admin_settings', {
        layout: 'layouts/admin_layout',
    })
}

const admin_institution_supervisor_student = async (req, res) => {
    const supervisor = req.query.supervisor;
    const trimmmed = supervisor.trim()
    const fetch_query = 'SELECT * FROM institution_supervisors WHERE full_name=$1';

    const result = await con.query(fetch_query, [trimmmed]);


    const supervisor_details = result.rows[0];
    const fetch_query2 = 'SELECT * FROM students WHERE institution_supervisor=$1 '
    const id = supervisor_details.id
    const result2 = await con.query(fetch_query2, [id])
    const students = result2.rows;
    res.render('admin_views/admin_institution_supervisor_students', {
        layout: 'layouts/admin_layout',
        supervisor,
        supervisor_details,
        students
    })
}




module.exports = {
    admin_dashboard,
    admin_institutions,
    admin_specific_institution_supervisors,
    admin_industries,
    admin_specific_industry_supervisors,
    admin_students,
    admin_specific_students,
    admin_industries_supervisors,
    admin_institutions_supervisors,
    admin_settings,
    admin_institution_supervisor_student
}