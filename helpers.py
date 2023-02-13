#There is two things I am proud of this code is that I learned that in python the aproach is 
# different than in javascript. Here we usually go with try/except so oposite to the code
#I showed in typescript, we simply attempt to do something and if something fails we handle
#the error. Something like doing before asking :)
# The concept of rollback is something I learned on how to take care of the database session
# process when we already made some actions and we want to undoo that.



# Create public project (with member assign)
    def create_publicproject(user, name, code, description, status,
                             project_type):
        """Creates a new publicproject with maker as member with provided role
            and status_project.
        IN: user<user_logged>View scripts/examples/common.py for more info
            name<string>,
            code<string>,
            description<string>,
            status<string>,
            company_id<int>: reference to company.id see
                tinkiservice/project/__init__.py,
            project_type: project object attributes (see Project object in
                tinkiservice/project/__init__.py)
        OUT:None: For error case
            newProject<Project>: For success case"""
        # Code is repeted here from general project creation because we need get
        #   use of db.session.flush and commit for error cases
        try:
            newproject = Project()
            newproject.user_id = user.id
            newproject.etag = gen_salt(40)
            newproject.created = newproject.updated = datetime.utcnow()
            newproject.name = name
            newproject.code = code
            newproject.description = description
            newproject.status = status
            newproject.company_id = user.company_id
            newproject.project_type = project_type
            db.session.add(newproject)
            db.session.flush()

            newmember = Member()
            newmember.etag = gen_salt(40)
            newmember.created = newmember.updated = datetime.utcnow()
            newmember.user_id = user.id
            newmember.project_id = newproject.id
            newmember.member_role = Query.MEMBER_ROLE_MANAGER
            db.session.add(newmember)
            logger.info(f"Member:[Project: {newproject.id} user:{user.id}")

            # for this user we need create a default status project values
            StatusProject.create_status_project_for_user(newproject.id,
                                                         user.id,
                                                         commit=False)

            db.session.commit()
        except:
            logger.exception(f"Error")
            db.session.rollback()
            logger.error(f"Error creating project, member or status_project"
                         f"project_id={newproject.id},  user_id={user.id}")
            return None

        logger.info(f"New project({newproject.id}) added")
        logger.info(f"Project.serialize()): {newproject.serialize()}")
        logger.info(f"New member({newmember.id}) added")
        logger.info(f"Member.serialize()): {newmember.serialize()}")
        logger.info(f"New status_project added")
        logger.info(f"Returning info model: {newproject}")

        return newproject