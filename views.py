#Example of endpoint used with the helper.py
#What I like from this code is the @swag_from which allows to have all
# the endpoints descriptions in a certain route. So you can check which
# is the contract of this endpoint, which properties expects to receieve and return.
# I also like the idea of using a forbidden_access() function instead of
#hardcoding a forbidden access response, which is more consistent.
# I like using separate logger.info and logger.debug so depending on the selected mode
# we can log only the necessary info.
# I like the idea that all the logic of this endpoint is in a helper funcion 
# so the view is not too long.

@publicprojects_views.route("/", methods=["POST"], strict_slashes=False)
@provider.require_oauth()
@quotes_token()
@keysecurity([ProjectPolicies.COMPANYX_CREATE_PUBLICPROJECT])
@swag_from("publicprojectindex.yml")
def publicprojects_post(auth=None):
    """"Creates a publicproject and assigns creator as a member to it
    "name": "Test_archived", "code": "", "description": "","company_id": "1",
            "status": Testing.TR_PROJECT_TEST,"project_type": 0,}
    TESTED: test_publicproject_post in tests/test_project_publicproject.py"""
    logger.debug(f"Entering ...")

    user_logged = KeyHelper.get_auth_userlogged(auth)

    data = json.loads(request.data)

    logger.info(f"user_logged: {user_logged}, data: {data}")

    public_project = Project.create_publicproject(user_logged,
                                                  data.get("name"),
                                                  data.get("code"),
                                                  data.get("description"),
                                                  data.get("status"),
                                                  data.get("project_type")
                                                  )

    if public_project is None:
        return jsonify(forbidden_access()), 403
    else:
        logger.info(f"public_project: {public_project.serialize_extended(auth)}")
        return jsonify(public_project.serialize_extended(auth)), 201