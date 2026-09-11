const ApprovedCourseModel =
  require('../models/approvedCourse.model');

const CourseModel =
  require('../models/course.model');

const UserModel =
  require('../models/user.model');

class ApprovedCourseService {
  static formatCourse(row) {
    return {
      id: row.course_id,
      code: row.code,
      name: row.name,
      credits: row.credits,
      semester: row.semester,
      approvedAt: row.approved_at
    };
  }

  static async getByUserId(userId) {
    const user =
      await UserModel.findById(userId);

    if (!user) {
      const error =
        new Error('Usuario no encontrado');

      error.statusCode = 404;

      throw error;
    }

    const rows =
      await ApprovedCourseModel.findByUserId(
        userId
      );

    const totalCredits =
      await ApprovedCourseModel
        .getTotalCredits(userId);

    return {
      courses: rows.map(
        ApprovedCourseService.formatCourse
      ),
      totalCredits
    };
  }

  static async getByAcademicRegistry(
    academicRegistry
  ) {
    const user =
      await UserModel.findByAcademicRegistry(
        academicRegistry
      );

    if (!user) {
      const error =
        new Error('Usuario no encontrado');

      error.statusCode = 404;

      throw error;
    }

    return ApprovedCourseService.getByUserId(
      user.id
    );
  }

  static async addCourse(
    userId,
    courseId
  ) {
    if (!courseId) {
      const error =
        new Error(
          'Debe seleccionar un curso'
        );

      error.statusCode = 400;

      throw error;
    }

    const course =
      await CourseModel.findById(courseId);

    if (!course) {
      const error =
        new Error('Curso no encontrado');

      error.statusCode = 404;

      throw error;
    }

    const existing =
      await ApprovedCourseModel.findOne(
        userId,
        courseId
      );

    if (existing) {
      const error =
        new Error(
          'El curso ya se encuentra registrado como aprobado'
        );

      error.statusCode = 409;

      throw error;
    }

    await ApprovedCourseModel.create(
      userId,
      courseId
    );

    return ApprovedCourseService.getByUserId(
      userId
    );
  }

  static async removeCourse(
    userId,
    courseId
  ) {
    const existing =
      await ApprovedCourseModel.findOne(
        userId,
        courseId
      );

    if (!existing) {
      const error =
        new Error(
          'El curso no se encuentra en el expediente'
        );

      error.statusCode = 404;

      throw error;
    }

    await ApprovedCourseModel.delete(
      userId,
      courseId
    );

    return ApprovedCourseService.getByUserId(
      userId
    );
  }
}

module.exports = ApprovedCourseService;