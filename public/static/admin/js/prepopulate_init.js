(function(b){var a=b("#django-admin-prepopulated-fields-constants").data("prepopulatedFields");b.each(a,function(c,d){b(".empty-form .form-row .field-"+d.name+", .empty-form.form-row .field-"+d.name).addClass("prepopulated_field");b(d.id).data("dependency_list",d.dependency_list).prepopulate(d.dependency_ids,d.maxLength,d.allowUnicode)})})(django.jQuery);