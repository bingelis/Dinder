<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * User controller.
 *
 * @Route("user")
 */
class UserController extends Controller
{
    /**
     * Displays current user entity.
     *
     * @Route("/", name="user_show")
     *
     * @Method("GET")
     *
     * @return Response
     */
    public function showAction(): Response
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();

        return $this->render('user/show.html.twig', array(
            'user' => $user,
        ));
    }

    /**
     * Displays a form to edit current user entity.
     *
     * @Route("/edit", name="user_edit")
     *
     * @Method({"GET", "POST"})
     *
     * @param Request $request
     *
     * @return Response
     */
    public function editAction(Request $request): Response
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $editForm = $this->createForm('AppBundle\Form\UserType', $user, ['facebook' => $user->getFacebookId()]);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('user_show');
        }

        return $this->render('user/edit.html.twig', array(
            'user' => $user,
            'edit_form' => $editForm->createView(),
        ));
    }
}
